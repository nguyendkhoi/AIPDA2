// ProgramFormModal.tsx
import React, { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { WorkshopFormData, Edition } from "../../types/programs";

interface ProgramFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkshopFormData) => Promise<void>;
  initialFormData: WorkshopFormData;
  editingWorkshopId: string | number | null;
  error: string | null;
  EDITIONS: Edition[];
  PROGRAMS: string[];
  THEMES: string[];
}

const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialFormData,
  editingWorkshopId,
  error,
  EDITIONS,
  PROGRAMS,
  THEMES,
}) => {
  const [currentFormData, setCurrentFormData] =
    useState<WorkshopFormData>(initialFormData);

  useEffect(() => {
    setCurrentFormData(initialFormData);
  }, [initialFormData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentFormData((prevData) => ({
      ...prevData,
      [name]: name === "nb_participants_max" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(currentFormData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm shadow-2xl flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingWorkshopId ? "Modifier le programme" : "Ajouter un programme"}
        </h2>

        {error && (
          <div
            className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edition_du_Tour"
              className="block text-sm font-medium text-gray-700"
            >
              Édition du Tour
            </label>
            <select
              id="edition_du_Tour"
              name="edition_du_Tour"
              value={currentFormData.edition_du_Tour}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
            >
              {EDITIONS.map((edition) => (
                <option key={edition} value={edition}>
                  {edition}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Type de Programme
            </label>
            <select
              id="name"
              name="name"
              value={currentFormData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
            >
              <option value="">-- Choisir --</option>
              {PROGRAMS.map((program) => (
                <option key={program} value={program.toLowerCase()}>
                  {program}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700"
            >
              Date de début
            </label>
            <input
              id="start_date"
              type="date"
              name="start_date"
              value={currentFormData.start_date}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700"
            >
              Thème
            </label>
            <select
              id="theme"
              name="theme"
              value={currentFormData.theme}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
            >
              {THEMES.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={currentFormData.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-vertical"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="nb_participants_max"
              className="block text-sm font-medium text-gray-700"
            >
              Participants Max
            </label>
            <input
              id="nb_participants_max"
              type="number"
              name="nb_participants_max"
              value={currentFormData.nb_participants_max ?? 50}
              onChange={handleInputChange}
              min={1}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              aria-label="Soumettre le programme"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {editingWorkshopId ? "Mettre à jour" : "Créer le programme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramFormModal;
