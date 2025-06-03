import React from "react";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";
import { useAuth } from "../Context/AuthContext.tsx";
import { mockWorkshops } from "./mockWorkshops.tsx";
import { formatDate } from "../utils/D_formatters.tsx";

const HEURES_PAR_SESSION_DEFAUT = 2;

const DashBoard: React.FC = () => {
  const { user } = useAuth();
  const workshops = mockWorkshops;

  // --- Logique de calcul et de formatage (adaptée pour Workshop) ---
  const currentDate = new Date();

  // Filtrer/Trier basé sur workshop.start_date (string)
  const upcomingWorkshops = workshops
    .filter((workshop) => new Date(workshop.start_date) > currentDate)
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

  const pastWorkshops = workshops
    .filter((workshop) => new Date(workshop.start_date) <= currentDate)
    .sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );

  // Calcul des heures totales basé sur les workshops
  const totalHours = workshops.reduce((acc, workshop) => {
    return acc + (workshop.duration_hours || HEURES_PAR_SESSION_DEFAUT);
  }, 0);

  // --- Rendu JSX (adapté pour Workshop) ---
  return (
    // Wrapper principal (peut être ajusté si nécessaire)
    <div className="pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tableau de bord {user?.role}
            </h2>
            <p className="text-gray-600">Bienvenue, {user?.name}</p>
          </div>

          {/* Statistiques (utilise les longueurs des listes filtrées) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-indigo-50 rounded-lg p-5 sm:p-6">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">
                  Workshops à venir
                </h3>
              </div>
              <p className="text-3xl font-bold text-indigo-600">
                {upcomingWorkshops.length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-5 sm:p-6">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">
                  Workshops passés
                </h3>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {pastWorkshops.length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-5 sm:p-6">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">
                  Heures totales
                </h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">{totalHours}</p>{" "}
            </div>
          </div>

          {/* Section Workshops à venir */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Prochains workshops
            </h3>
            <div className="space-y-4">
              {upcomingWorkshops.length > 0 ? (
                upcomingWorkshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className="bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                  >
                    <div className="mb-2 sm:mb-0 sm:mr-4">
                      {/* Afficher nom et theme (ou title si vous préférez) */}
                      <p className="font-semibold text-gray-900">
                        {workshop.name} - {workshop.title || workshop.theme}
                      </p>
                      {/* Afficher animateurNom */}
                      <p className="text-sm text-indigo-700 font-medium">
                        Animé par: {workshop.animateur.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(new Date(workshop.start_date))}
                      </p>
                      {/* Afficher statut si pertinent */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                          workshop.status === "confirme"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {workshop.status}
                      </span>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      {/* Afficher participants actuel / max */}
                      <span className="text-sm text-gray-600">
                        {workshop.current_participant_count ?? "N/A"} /{" "}
                        {workshop.nb_participants_max ?? "N/A"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 italic">
                  Aucun workshop à venir programmé.
                </p>
              )}
            </div>
          </div>

          {/* Section Workshops passés */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Historique des workshops
            </h3>
            <div className="space-y-4">
              {pastWorkshops.length > 0 ? (
                pastWorkshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className="bg-gray-50 opacity-80 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                  >
                    {/* Opacité réduite pour passés */}
                    <div className="mb-2 sm:mb-0 sm:mr-4">
                      <p className="font-semibold text-gray-700">
                        {workshop.name} - {workshop.title || workshop.theme}
                      </p>
                      <p className="text-sm text-indigo-600 font-medium">
                        Animé par: {workshop.animateur.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(new Date(workshop.start_date))}
                      </p>
                      {/* Afficher le nombre de participants qui étaient là */}
                      <p className="text-xs text-gray-500 mt-1">
                        ({workshop.current_participant_count ?? "?"}{" "}
                        participants)
                      </p>
                    </div>
                    <div className="flex items-center text-green-500 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Terminé</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 italic">
                  Aucun workshop passé dans l'historique.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
