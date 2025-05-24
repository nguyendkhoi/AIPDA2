// src/pages/ProfilePage/ProfileHeader.tsx
import React from "react";
import { Edit2, LogOut } from "lucide-react";

interface ProfileHeaderProps {
  role: string;
  name: string;
  onToggleEdit: () => void;
  onLogout?: () => void; // Optionnel si handleLogout n'est pas toujours fourni
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  role = "Role non défini",
  name = "Ultilisateur",
  onToggleEdit,
  onLogout,
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-indigo-500/50 text-sm">
            {role}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleEdit}
            className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition"
            title="Modifier le profil"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
