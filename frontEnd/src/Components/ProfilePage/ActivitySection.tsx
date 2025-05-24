import React from "react";
import { Award, Calendar } from "lucide-react";
import {
  formatDate,
  getStatutColor,
  getStatutText,
} from "../../utils/D_formatters";
import participantsIcon from "../../assets/icons/participants.svg";
import { useAuth } from "../../Context/AuthContext";

interface ActivitySectionProps {
  registrations: any[]; // Définissez des types plus précis
  proposals: any[]; // Définissez des types plus précis
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
  registrations = [],
  proposals = [],
}) => {
  const { user } = useAuth();
  if (!user) return;
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        {user.role === "participant" ? (
          <>
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Mes inscriptions
          </>
        ) : (
          <>
            <Award className="w-5 h-5 mr-2 text-indigo-600" />
            Mes propositions
          </>
        )}
      </h2>
      <div className="space-y-4">
        {/* Affichage conditionnel : liste des inscriptions OU liste des propositions */}
        {user.role === "participant" ? (
          // Affichage des inscriptions
          registrations.length > 0 ? (
            registrations.map((reg, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {/* Utiliser optional chaining au cas où programs serait manquant */}
                      {reg.programme?.name || "Titre indisponible"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {reg.programme?.edition_du_Tour}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(reg.programme?.start_date) || "Type inconnu"}
                    </p>
                  </div>
                  <span
                    // Affichage du statut avec couleur dynamique
                    className={`px-3 py-1 rounded-full text-sm ${getStatutColor(
                      reg.statut
                    )}`}
                  >
                    {getStatutText(reg.statut)}
                  </span>
                </div>
                {/* Afficher la date d'inscription  */}
                <p className="mt-3 text-gray-600 text-sm border-t pt-3">
                  {formatDate(reg.date_inscription)}
                </p>
              </div>
            ))
          ) : (
            // Message si aucune inscription
            <p className="text-center text-gray-500 py-8">
              Vous n'avez pas encore d'inscriptions
            </p>
          )
        ) : // Affichage des propositions (si pas participant)
        proposals.length > 0 ? (
          proposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {prop.nom || "Titre indisponible"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Proposé le {formatDate(prop.creation_date)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {prop.theme || "Type inconnu"}{" "}
                    {/* Afficher le sous-type s'il existe */}
                    {prop.subtype && `- ${prop.subtype}`}
                  </p>
                </div>
                <div>
                  <p // Affichage du statut avec couleur dynamique
                    className={`flex justify-center px-3 py-1 rounded-full text-sm ${getStatutColor(
                      prop.statut
                    )}`}
                  >
                    {getStatutText(prop.statut)}
                  </p>
                  <p
                    className={`inline-flex px-3 py-1 rounded-full text-sm mt-2 bg-gray-100`}
                  >
                    <img src={participantsIcon} />
                    {prop.nb_participants_actuel} / {prop.nb_participants_max}{" "}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-gray-600 border-t pt-3">
                {prop.description || "Pas de description"}
              </p>
              {/* Afficher les dates souhaitées si elles existent */}
              {prop.preferred_dates && prop.preferred_dates.length > 0 && (
                <div className="mt-3 text-sm text-gray-500">
                  <strong>Dates souhaitées :</strong>
                  <ul className="list-disc list-inside mt-1">
                    {/* Utiliser les types explicites pour date et index */}
                    {prop.preferred_dates.map((date: Date, index: number) => (
                      <li key={index}>{formatDate(date)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          // Message si aucune proposition
          <p className="text-center text-gray-500 py-8">
            Vous n'avez pas encore de propositions
          </p>
        )}
      </div>
    </section>
  );
};
export default ActivitySection;
