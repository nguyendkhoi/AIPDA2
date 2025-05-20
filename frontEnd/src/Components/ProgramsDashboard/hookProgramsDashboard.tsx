import {
  useCallback,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
  useMemo,
} from "react";
import { Edition, Workshop } from "../../types/types.ts";
import {
  WorkshopFormData,
  AnimateurProgrammeAPIResponse,
} from "../../types/programs.ts";
import { useAuth } from "../../Context/AuthContext.tsx";
import {
  getAnimateurProgrammes,
  createProgramme,
  updateProgramme,
  deleteProgramme,
} from "../../api/programs.ts";

interface UseProgramsDashboardProps {
  initialFormData: WorkshopFormData;
  initialSelectedEdition: Edition;
}

export const hookProgramsDashboard = ({
  initialFormData,
  initialSelectedEdition,
}: UseProgramsDashboardProps) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<Edition>(
    initialSelectedEdition
  );
  const [formData, setFormData] = useState<WorkshopFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkshopId, setEditingWorkshopId] = useState<
    string | number | null
  >(null);

  const { user } = useAuth();

  const fetchAndSetWorkshops = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rawProgrammes = await getAnimateurProgrammes();
      const formattedWorkshops: Workshop[] = rawProgrammes.map(
        (programme: AnimateurProgrammeAPIResponse) => ({
          id: String(programme.id),
          edition_du_Tour: programme.edition_du_Tour,
          name: programme.name,
          theme: programme.theme,
          duration_hours: programme.duration_hours || 0, // This field is not used in the UI provided
          description: programme.description,
          start_date: programme.start_date,
          nb_participants_max: programme.nb_participants_max,
          statut: programme.statut,
          creation_date: programme.creation_date,
          nb_participants_actuel: programme.nb_participants_actuel ?? 0,
          animateur: programme.animateur,
          title: programme.name || "",
        })
      );
      setWorkshops(formattedWorkshops);
    } catch (e: any) {
      console.error("Erreur lors de la récupération des programmes:", e);
      const errorDetail =
        e.response?.data?.detail ||
        e.response?.data?.error ||
        e.response?.data?.non_field_errors;
      setError(
        errorDetail ||
          e.message ||
          "Une erreur est survenue lors du chargement."
      );
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed `user` dependency as it's not directly used here, but rather in useEffect

  const handleCancelForm = useCallback(() => {
    setIsFormOpen(false);
    setFormData(initialFormData);
    setError(null);
    setEditingWorkshopId(null);
  }, [initialFormData]);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (!user) {
        setError("Utilisateur non authentifié.");
        return;
      }

      try {
        if (editingWorkshopId) {
          await updateProgramme(editingWorkshopId, formData);
        } else {
          await createProgramme(formData);
        }
        fetchAndSetWorkshops(); // Refresh the list
        handleCancelForm(); // Close and reset form on success
      } catch (e: any) {
        console.error(
          `Erreur lors de ${
            editingWorkshopId ? "la mise à jour" : "l'ajout"
          } du programme:`,
          e
        );
        let errorMessage = `Une erreur est survenue lors de ${
          editingWorkshopId ? "la mise à jour" : "la création"
        }.`;
        if (e.response && e.response.data) {
          const errorData = e.response.data;
          const fieldErrors = Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("; ");
          if (fieldErrors) {
            errorMessage = fieldErrors;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } else if (e.message) {
          errorMessage = e.message;
        }
        setError(errorMessage);
        // Form remains open for correction
      }
    },
    [user, editingWorkshopId, formData, fetchAndSetWorkshops, handleCancelForm]
  );

  const handleDeleteWorkshop = useCallback(
    async (id: string | number) => {
      if (!user) {
        setError("Utilisateur non authentifié.");
        return;
      }
      if (user.role !== "animateur") {
        setError(
          "Accès refusé: Seul un animateur peut supprimer des programmes."
        );
        return;
      }

      if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?"))
        return;

      try {
        await deleteProgramme(id);
        console.log(`Programme avec ID ${id} supprimé.`);
        fetchAndSetWorkshops();
      } catch (e: any) {
        console.error("Erreur lors de la suppression:", e);
        const errorDetail = e.response?.data?.detail || e.response?.data?.error;
        setError(
          errorDetail ||
            e.message ||
            "Une erreur est survenue lors de la suppression."
        );
      }
    },
    [user, fetchAndSetWorkshops]
  );

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;
      let processedValue: string | number | undefined = value;

      if (type === "number") {
        if (value === "") {
          processedValue = undefined; // Or keep as empty string if your WorkshopFormData allows for nb_participants_max
        } else {
          const num = parseInt(value, 10);
          processedValue = isNaN(num)
            ? name === "nb_participants_max"
              ? undefined
              : 0
            : num; // Fallback to undefined for nb_participants_max to trigger required or use 0 for other potential number fields
        }
      }
      setFormData((prevData) => ({ ...prevData, [name]: processedValue }));
    },
    []
  );

  const handleOpenFormForCreate = useCallback(() => {
    setEditingWorkshopId(null);
    setFormData(initialFormData);
    setError(null);
    setIsFormOpen(true);
  }, [initialFormData]);

  const handleOpenFormForEdit = useCallback((workshop: Workshop) => {
    setEditingWorkshopId(workshop.id);
    const dateForInput = workshop.start_date
      ? workshop.start_date.split("T")[0]
      : "";

    setFormData({
      edition_du_Tour: workshop.edition_du_Tour,
      name: workshop.name,
      theme: workshop.theme,
      description: workshop.description,
      start_date: dateForInput,
      nb_participants_max: workshop.nb_participants_max,
    });
    setError(null);
    setIsFormOpen(true);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAndSetWorkshops();
    } else {
      setIsLoading(false);
      setWorkshops([]);
    }
  }, [fetchAndSetWorkshops, user]);

  const filteredWorkshops = useMemo(() => {
    return workshops.filter(
      (workshop) => workshop.edition_du_Tour === selectedEdition
    );
  }, [workshops, selectedEdition]);

  return {
    workshops, // raw workshops, might not be needed by UI if filteredWorkshops is always used
    isFormOpen,
    selectedEdition,
    formData,
    isLoading,
    error,
    editingWorkshopId,
    // user, // UI might not need the whole user object
    // fetchAndSetWorkshops, // Not directly called by UI
    handleFormSubmit,
    handleDeleteWorkshop,
    handleChange,
    handleOpenFormForCreate,
    handleOpenFormForEdit,
    handleCancelForm,
    setSelectedEdition,
    filteredWorkshops,
  };
};
