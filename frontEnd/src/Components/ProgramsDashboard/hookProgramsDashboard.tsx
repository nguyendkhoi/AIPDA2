import {
  useCallback,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
  useMemo,
} from "react";
import { WorkshopFormData, Workshop, Edition } from "../../types/programs.ts";
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

  const { user, setAlertInfo, alertInfo } = useAuth();

  const fetchAndSetWorkshops = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rawProgrammes = await getAnimateurProgrammes();
      setWorkshops(rawProgrammes);
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
          const isUpdated = await updateProgramme(editingWorkshopId, formData);
          if (isUpdated) {
            setAlertInfo({ message: "Mise à jour success", type: "success" });
          }
        } else {
          const isCreated = await createProgramme(formData);
          if (isCreated) {
            setAlertInfo({ message: "Ajoute une programme", type: "success" });
          }
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
        setAlertInfo({ message: `${errorMessage}`, type: "error" });
        // Form remains open for correction
      }
    },
    [user, editingWorkshopId, formData, fetchAndSetWorkshops, handleCancelForm]
  );

  const handleDeleteWorkshop = useCallback(
    async (id: string | number) => {
      if (!user) {
        setError("Utilisateur non authentifié.");
        setAlertInfo({
          message: "Utilisateur non authentifié.",
          type: "error",
        });
        return;
      }
      if (user.role !== "animateur") {
        setError(
          "Accès refusé: Seul un animateur peut supprimer des programmes."
        );
        setAlertInfo({
          message:
            "Accès refusé: Seul un animateur peut supprimer des programmes.",
          type: "error",
        });
        return;
      }

      if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?"))
        return;

      try {
        const isDeleted = await deleteProgramme(id);
        console.log(`Programme avec ID ${id} supprimé.`);
        if (isDeleted) {
          setAlertInfo({ message: "La programme  est supprimé", type: "info" });
        }
        fetchAndSetWorkshops();
      } catch (e: any) {
        const errorDetail =
          e.response?.data?.detail ||
          e.response?.data?.error ||
          "Une erreur est survenue lors de la suppression.";
        setError(errorDetail);
        setAlertInfo({ message: errorDetail, type: "error" });
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
