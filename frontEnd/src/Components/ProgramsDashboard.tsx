import React, { useCallback, useEffect, useState, FormEvent } from "react";
import { Edition, Workshop } from "../types.ts";
import { Calendar, Edit2, PlusCircle, Trash2, Users } from "lucide-react";
import { useAuth } from "./Context/AuthContext.tsx";

const API_BASE_URL = "http://localhost:8000";

interface WorkshopFormData {
  edition_du_Tour: string;
  nom: string;
  theme: string;
  description: string;
  date_de_debut: string;
  nb_participants_max: number;
}

const ProgramsDashboard: React.FC = () => {
  // State remains similar
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<Edition>("Juin 2025");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<WorkshopFormData>({
    edition_du_Tour: "Juin 2025",
    nom: "",
    theme: "",
    description: "",
    date_de_debut: "",
    nb_participants_max: 50,
  });

  const editions: Edition[] = ["Avril 2025", "Juin 2025", "Août 2025"];
  const programs = ["Webinaire", "Atelier", "Talk"];
  const themes = [
    "Design Thinking",
    "Agilité",
    "Innovation",
    "Leadership",
    "Communication",
  ];

  const { user, authToken, API_BASE_URL } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
    console.log("Form data updated:", formData);
  };

  const handleAnnuler = () => {
    setIsFormOpen(false);
    setFormData({
      edition_du_Tour: "Juin 2025",
      nom: "",
      theme: "",
      description: "",
      date_de_debut: "",
      nb_participants_max: 50,
    });
  };

  const getWorkshops = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!authToken || !API_BASE_URL) {
      setError("Authentification ou URL API manquante.");
      setIsLoading(false);
      return;
    }
    console.log("Fetching workshops with token:", authToken);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/programme/animateur_programmes/`,
        {
          // Example endpoint: List all programmes
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur réseau ${response.statusText}`);
      }

      const data = await response.json();

      const formattedWorkshops: Workshop[] = data.map((programme: any) => ({
        id: programme.id,
        animatorId: programme.animateur?.id,
        edition: programme.edition_du_Tour,
        program: programme.nom,
        theme: programme.theme,
        title: programme.nom,
        description: programme.description,
        date: programme.date_de_debut,
        maxParticipants: programme.nb_participants_max,
        statut: programme.statut,
        createdAt: programme.date_de_creation,
        nb_participants_actuel: programme.nb_participants_actuel ?? 0,
        animateurNom: `${programme.animateur?.prenom ?? ""} ${
          programme.animateur?.nom ?? "N/A"
        }`,
      }));

      setWorkshops(formattedWorkshops);
      // --- End of mapping ---
    } catch (e: any) {
      console.error("Erreur lors de la récupération des programmes:", e);
      setError(e.message || "Une erreur est survenue lors du chargement.");
    } finally {
      setIsLoading(false);
    }
  }, [authToken, API_BASE_URL]);

  useEffect(() => {
    getWorkshops();
  }, [getWorkshops]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!user?.id || !authToken || !API_BASE_URL) {
      setError("Utilisateur non authentifié ou configuration API manquante.");
      return;
    }

    console.log("Form data before submission:", formData);
    // --- IMPORTANT: Construct payload matching YOUR API endpoint requirements ---
    const newWorkshopData = {
      ...formData,
      nom: formData.nom.toLowerCase(),
      temps_de_participation: 0,
      statut: "pending",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/create_programme/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkshopData),
      });

      if (!response.ok) {
        // Try to get error details from API response
        const errorData = await response.json().catch(() => ({})); // Catch if response not JSON
        console.error("API Error Details:", errorData);
        throw new Error(
          errorData.detail ||
            errorData.error ||
            `Erreur ${response.status}: ${response.statusText}`
        );
      }

      getWorkshops(); // Re-fetch the list to include the new item
      setIsFormOpen(false);
      setFormData({
        edition_du_Tour: "Juin 2025",
        nom: "",
        theme: "",
        description: "",
        date_de_debut: "",
        nb_participants_max: 50,
      });
    } catch (e: any) {
      console.error("Erreur lors de l’ajout du programme:", e);
      setError(e.message || "Une erreur est survenue lors de la création.");
    }
  };

  // --- Refactored Deletion ---
  const deleteWorkshop = async (id: string | number) => {
    // Use string or number depending on your ID type
    setError(null); // Clear previous errors
    if (!authToken || !API_BASE_URL) {
      setError("Authentification ou URL API manquante.");
      return;
    }

    // Optional: Add confirmation dialog
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
      return;
    }

    try {
      // Replace with your actual API endpoint for DELETING programs
      // Ensure it uses the correct HTTP method (DELETE)
      const response = await fetch(`${API_BASE_URL}/api/programme/${id}/`, {
        // Example: /api/programme/{id}/
        method: "DELETE",
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      // Check for 204 No Content or other success status
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.error ||
            `Erreur ${response.status}: ${response.statusText}`
        );
      }

      // Success: Refresh list
      getWorkshops(); // Re-fetch the list after deletion
    } catch (e: any) {
      console.error("Erreur lors de la suppression:", e);
      setError(e.message || "Une erreur est survenue lors de la suppression.");
    }
  };

  // --- UI Rendering ---
  return (
    <div className="bg-gray-50 pt-28 min-h-screen">
      {" "}
      {/* Added min-h-screen */}
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 ">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord des programmes
          </h1>
        </div>
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 mt-16">
        {/* Display Global Errors */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        {/* Edition Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          {" "}
          {/* Use flex-wrap and gap */}
          {editions.map((edition) => (
            <button
              key={edition}
              onClick={() => setSelectedEdition(edition)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedEdition === edition
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300" // Added border for non-selected
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>{edition}</span>
            </button>
          ))}
        </div>

        {/* Add Workshop Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Ajouter un programme</span>
        </button>

        {/* Workshops List or Loading/Error State */}
        {isLoading ? (
          <div className="text-center py-10">Chargement des programmes...</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            {" "}
            {/* Added overflow-x-auto */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Adjust table headers to match displayed data */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Programme (Nom)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thème
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants (Actuel/Max)
                  </th>
                  {/* Add more headers if needed, e.g., Animator */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workshops
                  .filter((workshop) => workshop.edition === selectedEdition) // Keep filtering by edition
                  .map((workshop) => (
                    // Using fragment here, ensure key is on the element if needed elsewhere
                    <React.Fragment key={workshop.id}>
                      <tr>
                        {/* Update cell rendering to use correct field names */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {workshop.program}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workshop.date_de_debut
                            ? new Date(
                                workshop.date_de_debut
                              ).toLocaleDateString("fr-CA")
                            : "N/A"}
                        </td>{" "}
                        {/* Example formatting */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workshop.theme}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="w-5 h-5 text-gray-400 mr-1" />
                            {/* Display actual / max participants */}
                            <span>
                              {workshop.nb_participants_actuel ?? "N/A"} /{" "}
                              {workshop.maxParticipants ?? "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              title="Modifier"
                            >
                              {/* Add onClick handler for editing later */}
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteWorkshop(workshop.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                {/* Handle case where filtered list is empty */}
                {workshops.filter(
                  (workshop) => workshop.edition === selectedEdition
                ).length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      Aucun programme trouvé pour cette édition.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Workshop Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {" "}
            {/* Added z-index */}
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {" "}
              {/* Added max-height & overflow */}
              <h2 className="text-2xl font-bold mb-6">Ajouter un programme</h2>
              {/* Pass refactored handleSubmit */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* --- IMPORTANT: Ensure form fields match API payload --- */}
                <div>
                  <label
                    htmlFor="edition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Édition du Tour
                  </label>
                  <select
                    id="edition"
                    name="edition_du_Tour"
                    value={formData.edition_du_Tour}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {editions.map((edition) => (
                      <option key={edition} value={edition}>
                        {edition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="program"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type de Programme
                  </label>
                  <select
                    id="program"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">-- Choisir --</option>{" "}
                    {/* Added default empty option */}
                    {programs.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date de début
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date_de_debut" // Corresponds to 'date_de_debut' in API payload
                    value={formData.date_de_debut}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">-- Choisir --</option>
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Description Field */}
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
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="nb_participants_max"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre maximum de participants
                  </label>
                  <input
                    id="nb_participants_max"
                    type="number"
                    name="nb_participants_max" // Corresponds to 'nb_participants_max'
                    value={formData.nb_participants_max}
                    onChange={handleChange}
                    min={1}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  {" "}
                  {/* Added padding-top */}
                  <button
                    type="button"
                    onClick={() => handleAnnuler()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Créer le programme
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgramsDashboard;
