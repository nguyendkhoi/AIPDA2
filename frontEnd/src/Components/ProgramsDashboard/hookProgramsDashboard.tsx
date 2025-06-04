import { useCallback, useEffect, useState, useMemo } from "react";
import { WorkshopFormData, Workshop, Edition } from "../../types/programs.ts";
import { useAuth } from "../../Context/AuthContext.tsx";
import {
  getAnimateurProgrammes,
  createProgramme,
  updateProgramme,
  deleteProgramme,
} from "../../api/programs.ts";

const initialWorkshopFormData: WorkshopFormData = {
  edition_du_Tour: "Avril 2025",
  name: "",
  theme: "Design Thinking",
  description: "",
  start_date: "",
  nb_participants_max: 50,
};

export const hookProgramsDashboard = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentWorkshopDataForModal, setCurrentWorkshopDataForModal] =
    useState<WorkshopFormData>(initialWorkshopFormData);
  const [selectedEdition, setSelectedEdition] = useState<Edition>("Avril 2025");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkshopId, setEditingWorkshopId] = useState<
    string | number | null
  >(null);

  const { user, setAlertInfo } = useAuth();

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
  }, []);

  const handleCancelForm = useCallback(() => {
    setIsFormOpen(false);
    setCurrentWorkshopDataForModal(initialWorkshopFormData);
    setError(null);
    setEditingWorkshopId(null);
  }, []);

  const handleFormSubmit = useCallback(
    async (submittedFormData: WorkshopFormData) => {
      setError(null);

      if (!user) {
        setError("Utilisateur non authentifié.");
        return;
      }
      try {
        if (editingWorkshopId) {
          const isUpdated = await updateProgramme(
            editingWorkshopId,
            submittedFormData
          );
          if (isUpdated) {
            setAlertInfo({ message: "Mise à jour réussie", type: "success" });
          }
        } else {
          const isCreated = await createProgramme(submittedFormData);
          if (isCreated) {
            setAlertInfo({
              message: "Programme ajouté avec succès",
              type: "success",
            });
          }
        }
        await fetchAndSetWorkshops();
        handleCancelForm();
      } catch (e: any) {
        console.error(
          `Erreur lors de ${
            editingWorkshopId ? "la mise à jour" : "l'ajout"
          } du programme:`,
          e
        );
        const errorDetail =
          e.response?.data?.detail ||
          e.response?.data?.error ||
          e.response?.data?.non_field_errors?.[0] ||
          e.message;

        let errorMessage =
          errorDetail ||
          `Une erreur est survenue lors de ${
            editingWorkshopId ? "la mise à jour" : "la création"
          }.`;

        setError(errorMessage);
      }
    },
    [
      user,
      editingWorkshopId,
      fetchAndSetWorkshops,
      handleCancelForm,
      setAlertInfo,
    ]
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
        if (isDeleted) {
          setAlertInfo({
            message: "Le programme a été supprimé",
            type: "info",
          });
        }
        await fetchAndSetWorkshops();
      } catch (e: any) {
        const errorDetail =
          e.response?.data?.error ||
          "Une erreur est survenue lors de la suppression.";
        setAlertInfo({ message: errorDetail, type: "error" });
      }
    },
    [user, fetchAndSetWorkshops, setAlertInfo]
  );

  const handleOpenFormForCreate = useCallback(() => {
    setEditingWorkshopId(null);
    setCurrentWorkshopDataForModal(initialWorkshopFormData);
    setError(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenFormForEdit = useCallback((workshop: Workshop) => {
    setEditingWorkshopId(workshop.id);
    const dateForInput = workshop.start_date
      ? workshop.start_date.split("T")[0]
      : "";

    setCurrentWorkshopDataForModal({
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
  }, [selectedEdition, workshops]);

  return {
    workshops,
    isFormOpen,
    formData: currentWorkshopDataForModal,
    isLoading,
    error,
    editingWorkshopId,
    setSelectedEdition,
    selectedEdition,
    handleFormSubmit,
    handleDeleteWorkshop,
    handleOpenFormForCreate,
    handleOpenFormForEdit,
    handleCancelForm,
    filteredWorkshops,
  };
};
