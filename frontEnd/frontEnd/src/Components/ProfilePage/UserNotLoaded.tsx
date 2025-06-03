import React from "react";

interface UserNotLoadedProps {
  error: string | null;
}

const UserNotLoaded: React.FC<UserNotLoadedProps> = ({ error }) => (
  <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
    <div className="text-center">
      <p className="text-red-600">
        {error || "Impossible d'afficher le profil. Utilisateur non chargé."}
      </p>
    </div>
  </div>
);

export default UserNotLoaded;
