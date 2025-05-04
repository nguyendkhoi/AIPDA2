import React, {
  useCallback,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import { Edition, Workshop } from "../types.ts";
import { Calendar, Edit2, PlusCircle, Trash2, Users } from "lucide-react";
import { useAuth } from "./Context/AuthContext.tsx";

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

interface WorkshopFormData {
  edition_du_Tour: string;
  nom: string;
  theme: string;
  description: string;
  date_de_debut: string;
  nb_participants_max: number;
}

const initialFormData: WorkshopFormData = {
  edition_du_Tour: EDITIONS[1] || EDITIONS[0], // Mặc định edition thứ 2 hoặc 1
  nom: "",
  theme: "",
  description: "",
  date_de_debut: "",
  nb_participants_max: 50,
};

// --- Component Definition ---
const ProgramsDashboard: React.FC = () => {
  // --- State ---
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<Edition>(
    EDITIONS[1] || EDITIONS[0]
  );
  const [formData, setFormData] = useState<WorkshopFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ****** NEW STATE for Editing ******
  const [editingWorkshopId, setEditingWorkshopId] = useState<
    string | number | null
  >(null);

  // --- Context ---
  const { user, authToken, API_BASE_URL } = useAuth();

  // --- API Interaction Functions ---

  // Fetch workshops from the API
  const getWorkshops = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!authToken || !API_BASE_URL) {
      setError("Authentification ou URL API manquante.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/programme/animateur_programmes/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.error ||
            `Erreur réseau ${response.statusText}`
        );
      }
      const data = await response.json();
      const formattedWorkshops: Workshop[] = data.map((programme: any) => ({
        id: programme.id,
        animatorId: programme.animateur?.id,
        edition_du_Tour: programme.edition_du_Tour,
        nom: programme.nom,
        theme: programme.theme,
        description: programme.description,
        date_de_debut: programme.date_de_debut,
        nb_participants_max: programme.nb_participants_max,
        statut: programme.statut,
        date_de_creation: programme.date_de_creation,
        nb_participants_actuel: programme.nb_participants_actuel ?? 0,
        animateurNom: `${programme.animateur?.prenom ?? ""} ${
          programme.animateur?.nom ?? "N/A"
        }`,
      }));
      setWorkshops(formattedWorkshops);
    } catch (e: any) {
      console.error("Erreur lors de la récupération des programmes:", e);
      setError(e.message || "Une erreur est survenue lors du chargement.");
    } finally {
      setIsLoading(false);
    }
  }, [authToken, API_BASE_URL]);

  // Create a new workshop
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!user?.id || !authToken || !API_BASE_URL) {
      setError("Utilisateur non authentifié ou configuration API manquante.");
      return;
    }
    const newWorkshopData = { ...formData, nom: formData.nom.toLowerCase() };
    console.log("Sending data for CREATE:", newWorkshopData);
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
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Details on Create:", errorData);
        const errorMessage =
          Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("; ") || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      getWorkshops();
      setIsFormOpen(false);
      setFormData(initialFormData);
    } catch (e: any) {
      console.error("Erreur lors de l’ajout du programme:", e);
      setError(e.message || "Une erreur est survenue lors de la création.");
    }
  };

  // Handling Updates
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!editingWorkshopId || !authToken || !API_BASE_URL) {
      setError(
        "ID du programme manquant, authentification ou URL API manquante pour la mise à jour."
      );
      return;
    }

    const updatedWorkshopData = {
      ...formData,
      nom: formData.nom.toLowerCase(), // Ensure consistency if needed
    };
    console.log(
      `Sending data for UPDATE (ID: ${editingWorkshopId}):`,
      updatedWorkshopData
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/programme/${editingWorkshopId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedWorkshopData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Details on Update:", errorData);
        const errorMessage =
          Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("; ") || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Success
      getWorkshops(); // Refresh list
      setIsFormOpen(false); // Close modal
      setFormData(initialFormData); // Reset form
      setEditingWorkshopId(null); // Exit editing mode
    } catch (e: any) {
      console.error("Erreur lors de la mise à jour du programme:", e);
      setError(e.message || "Une erreur est survenue lors de la mise à jour.");
      // Keep form open for correction
    }
  };

  const deleteWorkshop = async (id: string | number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?"))
      return;
    setError(null);
    if (!authToken || !API_BASE_URL) {
      setError("Authentification ou URL API manquante.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/programme/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${authToken}` },
      });
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Details on Delete:", errorData);
        throw new Error(
          errorData.detail ||
            errorData.error ||
            `Erreur ${response.status}: ${response.statusText}`
        );
      }
      console.log(`Programme avec ID ${id} supprimé.`);
      getWorkshops();
    } catch (e: any) {
      console.error("Erreur lors de la suppression:", e);
      setError(e.message || "Une erreur est survenue lors de la suppression.");
    }
  };

  // --- Form Handling ---

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const processedValue = type === "number" ? parseInt(value, 10) || 0 : value;
    setFormData((prevData) => ({ ...prevData, [name]: processedValue }));
  };

  const handleOpenForm = () => {
    // ****** UPDATE: Ensure resetting edit state ******
    setEditingWorkshopId(null);
    setFormData(initialFormData);
    setError(null);
    setIsFormOpen(true);
  };

  // ****** NEW FUNCTION for Initiating Edit ******
  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshopId(workshop.id);
    setFormData({
      // Populate form with current workshop data
      edition_du_Tour: workshop.edition_du_Tour,
      nom: workshop.nom,
      theme: workshop.theme,
      description: workshop.description,
      date_de_debut: workshop.date_de_debut, // API should provide 'YYYY-MM-DD' or needs parsing here
      nb_participants_max: workshop.nb_participants_max,
    });
    setError(null);
    setIsFormOpen(true); // Open the modal
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
    setError(null);
    // ****** UPDATE: Ensure resetting edit state ******
    setEditingWorkshopId(null);
  };

  // --- Effects ---
  useEffect(() => {
    getWorkshops();
  }, [getWorkshops]);

  // --- Derived State ---
  const filteredWorkshops = workshops.filter(
    (workshop) => workshop.edition_du_Tour === selectedEdition
  );

  // --- UI Rendering ---
  return (
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
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
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
          onClick={handleOpenForm}
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
                  filteredWorkshops.map((workshop) => (
                    <tr key={workshop.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {workshop.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workshop.date_de_debut
                          ? new Date(workshop.date_de_debut).toLocaleDateString(
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
                            {workshop.nb_participants_actuel ?? "-"} /{" "}
                            {workshop.nb_participants_max ?? "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          {/* ****** UPDATE Edit Button ****** */}
                          <button
                            onClick={() => handleEdit(workshop)} // Call handleEdit on click
                            className="text-blue-600 hover:text-blue-800"
                            title="Modifier"
                            // disabled={false} // Remove or set to false
                          >
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      Aucun programme trouvé pour l'édition "{selectedEdition}".
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
            {/* ****** UPDATE Modal Title ****** */}
            <h2 className="text-2xl font-bold mb-6">
              {editingWorkshopId
                ? "Modifier le programme"
                : "Ajouter un programme"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={editingWorkshopId ? handleUpdate : handleSubmit}
              className="space-y-4"
            >
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
                  htmlFor="nom"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type de Programme
                </label>
                <select
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full pl-3 pr-8 py-1 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
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
                  htmlFor="date_de_debut"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date de début
                </label>
                <input
                  id="date_de_debut"
                  type="date"
                  name="date_de_debut"
                  value={formData.date_de_debut}
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
                  value={formData.nb_participants_max}
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
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Annuler
                </button>
                {/* ****** UPDATE Submit Button Text ****** */}
                <button
                  type="submit"
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
  );
};

export default ProgramsDashboard;
