import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }

      try {
        const profileData = await getUserProfile();

        setUserProfile({
          name: profileData.name || user.name,
          first_name: profileData.first_name || user.first_name,
          bio: profileData.bio || "",
          expertises: profileData.expertises || [],
        });

        const updatedUser = {
          ...user,
          name: profileData.name || user.name,
          first_name: profileData.first_name || user.first_name,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
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
  }, [user, setProposals, setRegistrations]); // Depend on user context

  // Generic handler for updating userProfile fields
  const handleUserProfileChange = (
    field: keyof UserProfileApiResponse,
    value: string | string[] | undefined
  ) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile!,
      [field]: value,
    }));
  };

  // Specific handler for expertise array changes
  const handleExpertiseChange = (index: number, value: string) => {
    if (!userProfile?.expertises) return; // Ensure expertises array exists
    const newExpertises = userProfile.expertises.map((ex, i) =>
      i === index ? value : ex
    );
    handleUserProfileChange("expertises", newExpertises);
  };

  const handleAddExpertiseField = () => {
    if (!userProfile?.expertises) {
      handleUserProfileChange("expertises", [""]); // Initialize if null
      return;
    }
    handleUserProfileChange("expertises", [...userProfile.expertises, ""]);
  };

  const handleRemoveExpertiseField = (indexToRemove: number) => {
    if (!userProfile?.expertises) return;
    handleUserProfileChange(
      "expertises",
      userProfile.expertises.filter((_, index) => index !== indexToRemove)
    );
  };

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
    return <ProfileLoading />; // User context not yet loaded
  }

  if (user === null) {
    return (
      <UserNotLoaded
        error={"Authentification requise ou profil introuvable."}
      />
    );
  }

  if (userProfile === null) {
    // If user exists but userProfile hasn't been fetched yet
    return <ProfileLoading />;
  }

  // --- Main component rendering ---
  return (
    <>
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <ProfileHeader
              name={user.name + "" + user.first_name}
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
