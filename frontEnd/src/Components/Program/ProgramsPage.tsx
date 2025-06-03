import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Context/AuthContext.tsx";
import { ProgramCard } from "./ProgramsCard.tsx";
import { Workshop, ProgramType, Session } from "../../types/programs.ts";
import { ProgramModal } from "./ProgramModal";
import { getAllPrograms } from "../../api/programs.ts";
import { addParticipantToProgram } from "../../api/programs";

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return weekNo;
}

const ProgramsPage = () => {
  const { user, setAlertInfo } = useAuth();
  const [selectedProgramForView, setSelectedProgramForView] =
    useState<Session | null>(null);
  const [programs, setPrograms] = useState<Workshop[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleReservation = async (
    programId: number,
    onSucces?: () => void
  ) => {
    if (!user) {
      setAlertInfo({
        message: "Vous devez être connecté pour réserver.",
        type: "error",
      });
      return;
    }

    try {
      await addParticipantToProgram(programId);

      onSucces && onSucces();
      setAlertInfo({ message: "Réservation réussie !", type: "success" });
    } catch (error: any) {
      let messageError = error.response.data.detail
        ? error.response.data.detail
        : "Error during reservation:";
      setAlertInfo({ message: messageError, type: "error" });
    }
  };

  const fetchPrograms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching programs...");

      const data = await getAllPrograms();
      setPrograms(data || []);
    } catch (err: any) {
      console.error("Error fetching programs:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors du chargement des programmes."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const processedCampaigns = useMemo(() => {
    if (!programs || programs.length === 0) {
      return [];
    }

    const groupedData = programs.reduce((acc, workshop) => {
      const month = workshop.edition_du_Tour || "Inconnu";
      const sessionDate = new Date(workshop.start_date);

      if (isNaN(sessionDate.getTime())) {
        console.warn(
          `Invalid date format for workshop ${workshop.id}: ${workshop.start_date}`
        );
        return acc;
      }
      const weekNumber = getWeekNumber(sessionDate);

      if (!acc[month]) {
        acc[month] = { month, weeksData: {} };
      }

      if (!acc[month].weeksData[weekNumber]) {
        acc[month].weeksData[weekNumber] = { weekNumber, sessions: [] };
      }

      const animateurInfo = workshop.animateur;
      const animateurSessionData = animateurInfo
        ? {
            name:
              `${animateurInfo.name || ""} ${
                animateurInfo.first_name || ""
              }`.trim() || "Animateur Inconnu",
            photo: animateurInfo.photo || undefined,
            role: animateurInfo.role || "",
          }
        : {
            id: "",
            name: "Animateur Inconnu",
            photo: undefined,
            role: "",
          };

      const sessionData: Session = {
        id: Number(workshop.id),
        date: sessionDate,
        type: workshop.name as ProgramType,
        theme: workshop.theme,
        availableSpots: workshop.nb_participants_max,
        current_participant_count: workshop.current_participant_count,
        animateur: animateurSessionData,
        description: workshop.description,
        duration_hours:
          workshop.duration_hours !== undefined &&
          workshop.duration_hours !== null
            ? String(workshop.duration_hours)
            : null,
      };

      acc[month].weeksData[weekNumber].sessions.push(sessionData);
      return acc;
    }, {} as Record<string, { month: string; weeksData: Record<number, { weekNumber: number; sessions: Session[] }> }>);

    const campaignArray = Object.values(groupedData).map((monthData) => {
      const sortedWeeks = Object.values(monthData.weeksData)
        .map((week) => ({
          ...week,
          sessions: week.sessions.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
          ),
        }))
        .sort((a, b) => a.weekNumber - b.weekNumber);
      return { month: monthData.month, weeks: sortedWeeks };
    });

    const monthsOrder = ["Avril 2025", "Juin 2025", "Août 2025"];

    campaignArray.sort((a, b) => {
      const aIndex = monthsOrder.indexOf(a.month);
      const bIndex = monthsOrder.indexOf(b.month);

      if (a.month === "Inconnu") return 1;
      if (b.month === "Inconnu") return -1;

      if (aIndex === -1 && bIndex === -1) return a.month.localeCompare(b.month);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });

    console.log("Final processed campaigns:", campaignArray);
    return campaignArray;
  }, [programs]);

  // --- Rendu JSX ---
  if (isLoading) {
    return (
      <div className="pt-20 px-4 text-center">Chargement des programmes...</div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-4 text-center text-red-600">Erreur: {error}</div>
    );
  }

  const currentCampaign = processedCampaigns[selectedCampaign];

  return (
    <div className="pt-20 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {" "}
          <div className="flex justify-start items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Programmes Disponibles
            </h1>
          </div>
          <div className="flex space-x-3 sm:space-x-4 mb-8 overflow-x-auto pb-2">
            {" "}
            {processedCampaigns.length > 0 ? (
              processedCampaigns.map((campaign, index) => (
                <button
                  key={campaign.month}
                  onClick={() => setSelectedCampaign(index)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm sm:text-base transition duration-150 ease-in-out ${
                    selectedCampaign === index
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {campaign.month}
                </button>
              ))
            ) : (
              <p className="text-gray-500 italic">
                Aucune édition de programme trouvée.
              </p>
            )}
          </div>
          <div className="space-y-12">
            {currentCampaign && currentCampaign.weeks.length > 0 ? (
              currentCampaign.weeks.map((week) => (
                <div key={`${currentCampaign.month}-${week.weekNumber}`}>
                  <h3 className="text-xl font-semibold mb-6 text-gray-700 border-b border-gray-300 pb-2">
                    Semaine {week.weekNumber}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {week.sessions.map((session) => (
                      <ProgramCard
                        key={session.id}
                        session={session}
                        onReserve={() => {
                          if (!user) {
                            window.location.href = "/inscription";
                          } else {
                            handleReservation(session.id, fetchPrograms);
                          }
                        }}
                        onView={() => setSelectedProgramForView(session)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10 italic">
                {processedCampaigns.length > 0 && currentCampaign
                  ? `Aucun programme trouvé pour ${currentCampaign.month}.`
                  : "Aucun programme à afficher."}
              </p>
            )}
          </div>
        </div>
      </div>
      {selectedProgramForView && (
        <ProgramModal
          selectedProgramForView={selectedProgramForView}
          setSelectedProgramForView={setSelectedProgramForView}
        />
      )}
    </div>
  );
};

export default ProgramsPage;
