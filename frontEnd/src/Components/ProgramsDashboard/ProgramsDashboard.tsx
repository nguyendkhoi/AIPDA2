import React, { useEffect } from "react";
import { Edition, Workshop } from "../../types/programs";
import { Calendar, Edit2, PlusCircle, Trash2, Users } from "lucide-react";
import { hookProgramsDashboard } from "./hookProgramsDashboard";
import ProgramFormModal from "./ProgramFormModal";

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

// --- Component Definition ---
const ProgramsDashboard: React.FC = () => {
  const {
    isFormOpen,
    formData,
    isLoading,
    error: pageError,
    editingWorkshopId,
    handleFormSubmit,
    handleDeleteWorkshop,
    handleOpenFormForCreate,
    handleOpenFormForEdit,
    handleCancelForm,
    filteredWorkshops,
    setSelectedEdition,
    selectedEdition,
  } = hookProgramsDashboard();
  const formError = isFormOpen ? pageError : null;
  const displayPageError = !isFormOpen && pageError;
  return (
    <>
      <div className="bg-gray-50 pt-20 md:pt-28 min-h-screen font-sans">
        {/* Header */}
        <header className="top-0 left-0 right-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Tableau de bord des programmes
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16">
          {" "}
          {/* Added mt-16 for fixed header */}
          {displayPageError && (
            <div
              className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg shadow"
              role="alert"
            >
              {displayPageError}
            </div>
          )}
          {/* Edition Filter */}
          <section aria-labelledby="edition-filter-heading" className="mb-6">
            <h2 id="edition-filter-heading" className="sr-only">
              Filtre par édition
            </h2>
            <div className="flex flex-wrap gap-3">
              {EDITIONS.map((edition) => (
                <button
                  key={edition}
                  onClick={() => setSelectedEdition(edition)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    selectedEdition === edition
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm hover:shadow-md"
                  }`}
                >
                  <Calendar className="w-4 h-4" /> <span>{edition}</span>
                </button>
              ))}
            </div>
          </section>
          {/* Add Button */}
          <div className="mb-6">
            <button
              onClick={handleOpenFormForCreate}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />{" "}
              <span>Ajouter un programme</span>
            </button>
          </div>
          {/* Workshops List / Loading Indicator */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-3 text-lg">Chargement des programmes...</p>
            </div>
          ) : (
            <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Programme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date Début
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thème
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWorkshops.length > 0 ? (
                    filteredWorkshops.map((workshop: Workshop) => (
                      <tr
                        key={workshop.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {workshop.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {workshop.start_date
                            ? new Date(workshop.start_date).toLocaleDateString(
                                "fr-CA",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {workshop.theme}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-1.5" />
                            <span>
                              {workshop.current_participant_count ?? "0"} /{" "}
                              {workshop.nb_participants_max ?? "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleOpenFormForEdit(workshop)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Modifier"
                              aria-label="Modifier le programme"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWorkshop(workshop.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
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
                        className="text-center py-10 text-gray-500"
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
        <ProgramFormModal
          isOpen={isFormOpen}
          onClose={handleCancelForm}
          onSubmit={handleFormSubmit}
          initialFormData={formData}
          editingWorkshopId={editingWorkshopId}
          error={formError}
          EDITIONS={EDITIONS}
          PROGRAMS={PROGRAMS}
          THEMES={THEMES}
        />
      </div>
    </>
  );
};

export default ProgramsDashboard;
