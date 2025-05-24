import React from "react";
import { Loader2, X } from "lucide-react";
import { UserProfileApiResponse } from "../../types/user";

interface ProfileEditFormProps {
  userProfile: UserProfileApiResponse | null;
  onProfileChange: (
    field: keyof UserProfileApiResponse,
    value: string | string[] | undefined
  ) => void;
  handleExpertiseChange: (index: number, value: string) => void;
  handleAddExpertiseField: () => void;
  handleRemoveExpertiseField: (index: number) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  userProfile,
  onProfileChange,
  handleExpertiseChange,
  handleAddExpertiseField,
  handleRemoveExpertiseField,
  onSubmit,
  onCancel,
  isSaving,
}) => {
  if (!userProfile) {
    return null;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Champ Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom
        </label>
        <input
          type="text"
          value={userProfile.name || ""}
          onChange={(e) => onProfileChange("name", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {/* Champ Prénom (First Name) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prénom
        </label>
        <input
          type="text"
          value={userProfile.first_name || ""}
          onChange={(e) => onProfileChange("first_name", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Champ Biographie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biographie
        </label>
        <textarea
          value={userProfile.bio || ""}
          onChange={(e) => onProfileChange("bio", e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Parlez-nous de vous..."
        />
      </div>

      {/* Champ pour l'expertise */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expertises
        </label>
        {Array.isArray(userProfile.expertises) &&
          userProfile.expertises.map((exItem, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={exItem}
                onChange={(e) => handleExpertiseChange(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Expertise ${index + 1}`}
              />
              {/* Only show remove button if there's more than one expertise or if it's not the last remaining empty field */}
              {userProfile.expertises!.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveExpertiseField(index)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  title="Supprimer cette expertise"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        <button
          type="button"
          onClick={handleAddExpertiseField}
          className="mt-2 px-4 py-2 border border-dashed border-indigo-400 text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2"
        >
          Ajouter une expertise
        </button>
      </div>

      {/* Boutons d'action du formulaire */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
              Enregistrement...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          disabled={isSaving}
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
