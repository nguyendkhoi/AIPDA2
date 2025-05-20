import { Loader2 } from "lucide-react";

const ProfileLoading = () => (
  <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      <span className="text-gray-600">Chargement du profil...</span>
    </div>
  </div>
);

export default ProfileLoading;
