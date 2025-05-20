import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";

import ProfileLoading from "./ProfileLoading";
import UserNotLoaded from "./UserNotLoaded";
import AlertMessage from "../AlertMessage";
import ProfileHeader from "./ProfileHeader";
import ProfileEditForm from "./ProfileEditForm";
import ProfileInfoDisplay from "./ProfileInfoDisplay";
import {
  getAnimateurProgrammes,
  getParticipantProgrammes,
} from "../../api/programs";

const ProfilePage = () => {
  const { user, handleLogout, handleUpdateUserProfile, isSaving } = useAuth();
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
    key?: number;
  } | null>(null);

  const [name, setName] = useState(user?.name || "Utilisateur");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);

  // Local state for editing bio and expertises
  const [editingBio, setEditingBio] = useState("");
  const [editingExpertise, setEditingExpertise] = useState<string[]>([]);

  // States for other data and UI
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);

  const submitChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const succesUpdateUserProfile = await handleUpdateUserProfile({
      name: name,
      bio: editingBio,
      expertises_input: editingExpertise,
    });

    if (succesUpdateUserProfile) {
      setIsEditing(false);
      setAlertInfo({
        message: "Profil mis à jour avec succès!",
        type: "success",
        key: Date.now(),
      });
    } else {
      setAlertInfo({
        message: "Erreur lors de la mise à jour.",
        type: "error",
        key: Date.now(),
      });
    }
  };

  useEffect(() => {
    const fetchUserProgrammes = async () => {
      if (user && user.id) {
        setIsLoadingPrograms(true);
        try {
          if (user.role == "participant") {
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

  useEffect(() => {
    if (user) {
      setName(user.name || "Utilisateur");
    } else {
      setName("Utilisateur");
    }
  }, [user, isEditing]);

  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertises = editingExpertise.map((ex, i) =>
      i === index ? value : ex
    );
    setEditingExpertise(newExpertises);
  };

  const handleAddExpertiseField = () => {
    setEditingExpertise([...editingExpertise, ""]);
  };

  const handleRemoveExpertiseField = (indexToRemove: number) => {
    setEditingExpertise(
      editingExpertise.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleToggleEdit = () => {
    if (!isEditing && user) {
      setName(user.name || "Utilisateur");
      setEditingBio(user.bio || "");
      setEditingExpertise(user.expertises || []);
    }
    setIsEditing(!isEditing);
  };

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

  return (
    <>
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <ProfileHeader
              user={user}
              onToggleEdit={handleToggleEdit}
              onLogout={handleLogout}
            />
            <div className="p-6">
              {isEditing ? (
                <ProfileEditForm
                  name={name}
                  setName={setName}
                  bio={editingBio}
                  setBio={setEditingBio}
                  expertise={editingExpertise}
                  handleExpertiseChange={handleExpertiseChange}
                  handleAddExpertiseField={handleAddExpertiseField}
                  handleRemoveExpertiseField={handleRemoveExpertiseField}
                  onSubmit={submitChange}
                  onCancel={() => setIsEditing(false)}
                  isSaving={isSaving}
                />
              ) : (
                <ProfileInfoDisplay
                  user={user}
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
