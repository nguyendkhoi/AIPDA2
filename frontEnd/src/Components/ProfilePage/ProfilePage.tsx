import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../Context/AuthContext";

import ProfileLoading from "./ProfileLoading";
import UserNotLoaded from "./UserNotLoaded";
import AlertMessage from "../AlertMessage";
import ProfileHeader from "./ProfileHeader";
import ProfileEditForm from "./ProfileEditForm";
import ProfileInfoDisplay from "./ProfileInfoDisplay";
import { UserProfileApiResponse } from "../../types/user";

import {
  getAnimateurProgrammes,
  getParticipantProgrammes,
} from "../../api/programs";
import { getUserProfile, updateUserProfile } from "../../api/user";

const ProfilePage = () => {
  const { user, setUser, handleLogout, alertInfo, setAlertInfo, setAuthToken } =
    useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileApiResponse | null>(
    null
  );

  // States for other data and UI
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  console.log("registration: ", registrations);
  console.log("proposals: ", proposals);
  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Fetch profile");
      console.log("User: ", user);
      if (!user) {
        setUserProfile(null);
        return;
      }
      setIsSaving(true);
      try {
        const profileData = await getUserProfile();
        setUserProfile({
          name: profileData.name || user.name,
          first_name: profileData.first_name || user.first_name,
          bio: profileData.bio || "",
          expertises: profileData.expertises || [],
        });

        const nameChanged = profileData.name && profileData.name !== user.name;
        const firstNameChanged =
          profileData.first_name && profileData.first_name !== user.first_name;

        if (nameChanged || firstNameChanged) {
          const updatedUser = {
            ...user,
            name: profileData.name || user.name,
            first_name: profileData.first_name || user.first_name,
          };
          localStorage.setItem("userData", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err);
        setAlertInfo({
          message: "Échec du chargement du profil. Veuillez vous reconnecter.",
          type: "error",
        });

        setUser(null);
        setUserProfile(null);
        setAuthToken(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
      } finally {
        setIsSaving(false);
      }
    };

    fetchProfile();
  }, [user, setUser, setAlertInfo, setAuthToken]);

  // Submit handler for profile changes
  const submitChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !user) {
      setAlertInfo({
        message:
          "Le profil utilisateur n'est pas chargé. Impossible de sauvegarder.",
        type: "error",
      });

      return;
    }

    // Pass the fields from local userProfile state to handleUpdateUserProfile
    const successUpdateUserProfile = await updateUserProfile({
      name: userProfile.name,
      first_name: userProfile.first_name,
      bio: userProfile.bio,
      expertises: userProfile.expertises,
    });

    if (successUpdateUserProfile) {
      setIsEditing(false);
      setAlertInfo({
        message: "Mise à jour du profil réussie",
        type: "success",
      });
    }
  };

  // Effect to fetch user's programs (registrations/proposals)
  useEffect(() => {
    const fetchUserProgrammes = async () => {
      if (user) {
        setIsLoadingPrograms(true);
        try {
          if (user.role === "participant") {
            const participantData = await getParticipantProgrammes();
            setRegistrations(participantData || []);
            console.log("Participant Data:", participantData);
          } else {
            const animateurData = await getAnimateurProgrammes();
            setProposals(animateurData || []);
            console.log("Animateur Data:", animateurData);
          }
        } catch (error) {
          console.error("Failed to fetch user programmes:", error);
          setRegistrations([]);
          setProposals([]);
        } finally {
          setIsLoadingPrograms(false);
        }
      } else {
        setRegistrations([]);
        setProposals([]);
      }
    };

    fetchUserProgrammes();
  }, [user]);

  // Generic handler for updating userProfile fields
  const handleUserProfileChange = useCallback(
    (
      field: keyof UserProfileApiResponse,
      value: string | string[] | undefined
    ) => {
      setUserProfile((prevProfile) => ({
        ...prevProfile!,
        [field]: value,
      }));
    },
    []
  );

  const handleExpertiseChange = useCallback((index: number, value: string) => {
    setUserProfile((prevProfile) => {
      if (!prevProfile?.expertises) return prevProfile;
      const newExpertises = prevProfile.expertises.map((ex, i) =>
        i === index ? value : ex
      );
      return { ...prevProfile, expertises: newExpertises };
    });
  }, []);

  const handleAddExpertiseField = useCallback(() => {
    setUserProfile((prevProfile) => {
      if (!prevProfile?.expertises) {
        return { ...prevProfile!, expertises: [""] };
      }
      return { ...prevProfile, expertises: [...prevProfile.expertises, ""] };
    });
  }, []);

  const handleRemoveExpertiseField = useCallback((indexToRemove: number) => {
    setUserProfile((prevProfile) => {
      if (!prevProfile?.expertises) return prevProfile;
      return {
        ...prevProfile,
        expertises: prevProfile.expertises.filter(
          (_, idx) => idx !== indexToRemove
        ),
      };
    });
  }, []);

  // Toggle edit mode and initialize userProfile for editing
  const handleToggleEdit = () => {
    if (!isEditing && userProfile) {
      // Ensure userProfile is loaded before entering edit mode
      // When entering edit mode, populate from the current userProfile state
      setUserProfile({
        name: userProfile.name || "Utilisateur",
        first_name: userProfile.first_name || "",
        bio: userProfile.bio || "",
        expertises: userProfile.expertises || [],
      });
    }
    setIsEditing(!isEditing);
  };

  // --- Render logic for loading and error states ---
  if (typeof user === "undefined") {
    return <ProfileLoading />;
  }

  if (user === null) {
    return (
      <UserNotLoaded
        error={"Authentification requise ou profil introuvable."}
      />
    );
  }

  if (userProfile === null) {
    return <ProfileLoading />;
  }

  // --- Main component rendering ---
  return (
    <>
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <ProfileHeader
              name={user.name + " " + user.first_name}
              role={user.role}
              onToggleEdit={handleToggleEdit}
              onLogout={handleLogout}
            />
            <div className="p-6">
              {isEditing ? (
                <ProfileEditForm
                  userProfile={userProfile}
                  onProfileChange={handleUserProfileChange}
                  handleExpertiseChange={handleExpertiseChange}
                  handleAddExpertiseField={handleAddExpertiseField}
                  handleRemoveExpertiseField={handleRemoveExpertiseField}
                  onSubmit={submitChange}
                  onCancel={() => setIsEditing(false)}
                  isSaving={isSaving}
                />
              ) : (
                <ProfileInfoDisplay
                  bio={userProfile.bio ?? ""}
                  expertises={userProfile.expertises ?? []}
                  registrations={registrations}
                  proposals={proposals}
                  isLoadingPrograms={isLoadingPrograms}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {alertInfo && (
        <AlertMessage
          key={alertInfo.key}
          message={alertInfo.message}
          type={alertInfo.type}
          onDismiss={() => setAlertInfo(null)}
        />
      )}
    </>
  );
};

export default ProfilePage;
