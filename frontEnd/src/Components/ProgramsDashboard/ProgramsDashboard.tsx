import React from "react";
import { WorkshopFormData, Edition, Workshop } from "../../types/programs.ts";
import { Calendar, Edit2, PlusCircle, Trash2, Users } from "lucide-react";
import { hookProgramsDashboard } from "./hookProgramsDashboard.tsx";
// --- Constants ---
const EDITIONS: Edition[] = ["Avril 2025", "Juin 2025", "Août 2025"];
const PROGRAMS: string[] = ["Webinaire", "Atelier", "Talk"];
const THEMES: string[] = [
  "Design Thinking",
  "Agilité",
  "Innovation",
  "Leadership",
  "Communication",
];

const getDefaultEdition = (editions: Edition[]): Edition => {
  if (editions.length > 1) return editions[1];
  if (editions.length > 0) return editions[0];
  return "" as Edition;
};

const defaultEdition = getDefaultEdition(EDITIONS);

const initialWorkshopFormData: WorkshopFormData = {
  edition_du_Tour: defaultEdition,
  name: "",
  theme: "",
  description: "",
  start_date: "",
  nb_participants_max: 50,
};

// --- Component Definition ---
const ProgramsDashboard: React.FC = () => {
  const {
    isFormOpen,
    selectedEdition,
    formData,
    isLoading,
    error,
    editingWorkshopId,
    handleFormSubmit,
    handleDeleteWorkshop,
    handleChange,
    handleOpenFormForCreate,
    handleOpenFormForEdit,
    handleCancelForm,
    setSelectedEdition,
    filteredWorkshops,
  } = hookProgramsDashboard({
    initialFormData: initialWorkshopFormData,
    initialSelectedEdition: defaultEdition,
  });

  return (
    <>
      <div className="bg-gray-50 pt-28 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord des programmes
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 mt-16">
          {error && !isFormOpen && (
            <div
              className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Edition Filter */}
          <div className="flex flex-wrap gap-4 mb-6">
            {EDITIONS.map((edition) => (
              <button
                key={edition}
                onClick={() => setSelectedEdition(edition)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  selectedEdition === edition
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                <Calendar className="w-5 h-5" /> <span>{edition}</span>
              </button>
            ))}
          </div>

          {/* Add Button */}
          <button
            onClick={handleOpenFormForCreate}
            className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusCircle className="w-5 h-5" /> <span>Ajouter un programme</span>
          </button>

          {/* Workshops List / Loading Indicator */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Chargement...</div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Début
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thème
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWorkshops.length > 0 ? (
                    filteredWorkshops.map((workshop: Workshop) => (
                      <tr key={workshop.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {workshop.name} {/* Corrected from workshop.nom */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workshop.start_date
                            ? new Date(workshop.start_date).toLocaleDateString(
                                "fr-CA"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workshop.theme}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="w-5 h-5 text-gray-400 mr-1" />
                            <span>
                              {workshop.current_participant_count ?? "-"} /{" "}
                              {workshop.nb_participants_max ?? "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleOpenFormForEdit(workshop)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Modifier"
                              aria-label="Modifier le programme"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWorkshop(workshop.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Supprimer"
                              aria-label="Supprimer le programme"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-500"
                      >
                        Aucun programme trouvé pour l'édition "{selectedEdition}
                        ".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* Add/Edit Workshop Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
              <h2 className="text-2xl font-bold mb-6">
                {editingWorkshopId
                  ? "Modifier le programme"
                  : "Ajouter un programme"}
              </h2>

              {error && (
                <div
                  className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
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
                    value={formData.edition_du_Tour}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-8 py-1 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
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
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-8 py-1 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                  >
                    <option value="">-- Choisir --</option>
                    {PROGRAMS.map((program) => (
                      <option key={program} value={program.toLocaleLowerCase()}>
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
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-1 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.theme}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-8 py-1 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                  >
                    <option value="">-- Choisir --</option>
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
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
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
                    value={formData.nb_participants_max ?? ""} // Ensure value is not undefined for controlled input
                    onChange={handleChange}
                    min={1}
                    required
                    className="block w-full px-3 py-1 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    aria-label="Soumettre le programme"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {editingWorkshopId ? "Mettre à jour" : "Créer le programme"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProgramsDashboard;
