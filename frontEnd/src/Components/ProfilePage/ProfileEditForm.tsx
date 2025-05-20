// src/pages/ProfilePage/ProfileEditForm.tsx
import React from "react";
import { Loader2, X } from "lucide-react"; // Assurez-vous que X est utilisé ou supprimez-le

interface ProfileEditFormProps {
  name: string;
  setName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  expertise: string[];
  handleExpertiseChange: (index: number, value: string) => void;
  handleAddExpertiseField: () => void;
  handleRemoveExpertiseField: (index: number) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  name,
  setName,
  bio,
  setBio,
  expertise,
  handleExpertiseChange,
  handleAddExpertiseField,
  handleRemoveExpertiseField,
  onSubmit,
  onCancel,
  isSaving,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Champ Nom Complet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom complet
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {/* Champ Biographie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biographie
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
        {Array.isArray(expertise) &&
          expertise.map((exItem, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={exItem}
                onChange={(e) => handleExpertiseChange(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Expertise ${index + 1}`}
              />
              {expertise.length > 0 && (
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
