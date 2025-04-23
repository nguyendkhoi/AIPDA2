import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext.tsx";
import { ProgramCard } from "./ProgramsCard.tsx";
import { Workshop, ProgramType, Session } from "../../types.ts";

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Thursday in current week decides the year.
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  // Return week number
  return weekNo;
}

const ProgramsPage = () => {
  const {
    user,
    authToken,
    API_BASE_URL,
    handleReservation,
    setSelectedProgramForView,
  } = useAuth();

  const [apiWorkshops, setApiWorkshops] = useState<Workshop[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWorkshopsFromApi = useCallback(async () => {
    if (!authToken || !API_BASE_URL) {
      setError("Erreur: Authentification ou URL API manquante.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    // setApiWorkshops([]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/programme/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(
          `Erreur API (${response.status}): ${
            response.statusText || "Impossible de récupérer les programmes"
          }`
        );
      }

      const data = await response.json();
      // console.log("API Response Data:", data);
      setApiWorkshops(data || []);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des programmes:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors du chargement des programmes."
      );
    } finally {
      setIsLoading(false);
    }
  }, [authToken, API_BASE_URL]);

  useEffect(() => {
    getWorkshopsFromApi();
  }, [getWorkshopsFromApi]);

  const campaigns = apiWorkshops.reduce((acc, workshop) => {
    const month = workshop.edition_du_Tour || "Inconnu";
    const sessionDate = new Date(workshop.date_de_debut);

    if (isNaN(sessionDate.getTime())) {
      console.warn(
        `Invalid date format for workshop ${workshop.id}: ${workshop.date_de_debut}`
      );
      return acc;
    }

    const weekNumber = getWeekNumber(sessionDate);

    if (!acc[month]) {
      acc[month] = { month, weeks: [] };
    }

    let week = acc[month].weeks.find((w) => w.weekNumber === weekNumber);
    if (!week) {
      week = { weekNumber, sessions: [] };
      acc[month].weeks.push(week);

      acc[month].weeks.sort((a, b) => a.weekNumber - b.weekNumber);
    }

    const sessionData: Session = {
      id: Number(workshop.id),
      date: sessionDate,
      type: workshop.nom as ProgramType,
      theme: workshop.theme,
      availableSpots: workshop.nb_participants_max,
      currentParticipants: workshop.nb_participants_actuel,
      animateur: workshop.animateur.id
        ? {
            id: workshop.animateur.id,
            nom:
              `${workshop.animateur.nom || ""} ${
                workshop.animateur.prenom || ""
              }`.trim() || "Animateur Inconnu",
            photo: workshop.animateur.photo || "null",
            role: workshop.animateur.role,
          }
        : { id: "", nom: "Animateur Inconnu", role: "" },
      description: workshop.description,
      durationHours:
        workshop.durationHours !== undefined
          ? String(workshop.durationHours)
          : null,
    };

    week.sessions.push(sessionData);
    week.sessions.sort((a, b) => a.date.getTime() - b.date.getTime());

    return acc;
  }, {} as Record<string, { month: string; weeks: { weekNumber: number; sessions: Session[] }[] }>);

  const campaignArray = Object.values(campaigns).sort((a, b) => {
    const monthsOrder = ["Avril 2025", "Juin 2025", "Août 2025"];
    return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
  });

  console.log("Transformed campaigns from API:", campaignArray);

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

  return (
    <div className="pt-20 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {" "}
          <div className="flex justify-start items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Programmes Disponibles
            </h1>
            {/* <button
                            onClick={() => setSelectedCampaign(0)} 
                            className="text-indigo-600 hover:text-indigo-700 transition text-sm font-medium"
                        >
                            (Voir toutes les éditions)
                        </button> */}
          </div>
          <div className="flex space-x-3 sm:space-x-4 mb-8 overflow-x-auto pb-2">
            {" "}
            {campaignArray.length > 0 ? (
              campaignArray.map((campaign, index) => (
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
            {campaignArray[selectedCampaign] &&
            campaignArray[selectedCampaign].weeks.length > 0 ? (
              campaignArray[selectedCampaign].weeks.map((week) => (
                <div
                  key={`${campaignArray[selectedCampaign].month}-${week.weekNumber}`}
                >
                  <h3 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">
                    Semaine {week.weekNumber}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Responsive grid */}
                    {week.sessions.map((session) => (
                      <ProgramCard
                        key={session.id}
                        session={session}
                        onReserve={() => {
                          if (!user) {
                            window.location.href = "/inscription";
                          } else {
                            handleReservation(session.id, getWorkshopsFromApi);
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
                {campaignArray.length > 0
                  ? `Aucun programme trouvé pour ${campaignArray[selectedCampaign]?.month}.`
                  : "Aucun programme à afficher."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
