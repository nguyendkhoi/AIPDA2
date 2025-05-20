import React from "react";
import AboutSection from "./AboutSection";
import ActivitySection from "./ActivitySection";
import ProfileLoading from "./ProfileLoading";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  bio: string;
  expertises?: string[];
}
interface ProfileInfoDisplayProps {
  user: User | null;
  registrations: any[];
  proposals: any[];
  isLoadingPrograms: boolean;
}

const ProfileInfoDisplay: React.FC<ProfileInfoDisplayProps> = ({
  user,
  registrations,
  proposals,
  isLoadingPrograms,
}) => {
  if (!user) return null;

  return (
    <div className="space-y-8">
      <AboutSection bio={user.bio} expertises={user.expertises} />
      {isLoadingPrograms ? (
        <ProfileLoading />
      ) : (
        <ActivitySection
          userRole={user.role}
          registrations={registrations}
          proposals={proposals}
        />
      )}
    </div>
  );
};

export default ProfileInfoDisplay;
