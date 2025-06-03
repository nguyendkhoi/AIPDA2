import React from "react";
import AboutSection from "./AboutSection";
import ActivitySection from "./ActivitySection";
import ProfileLoading from "./ProfileLoading";

interface ProfileInfoDisplayProps {
  bio: string;
  expertises: string[];
  registrations: any[];
  proposals: any[];
  isLoadingPrograms: boolean;
}

const ProfileInfoDisplay: React.FC<ProfileInfoDisplayProps> = ({
  bio,
  expertises,
  registrations = [],
  proposals = [],
  isLoadingPrograms,
}) => {
  return (
    <div className="space-y-8">
      <AboutSection bio={bio} expertises={expertises} />
      {isLoadingPrograms ? (
        <ProfileLoading />
      ) : (
        <ActivitySection registrations={registrations} proposals={proposals} />
      )}
    </div>
  );
};

export default ProfileInfoDisplay;
