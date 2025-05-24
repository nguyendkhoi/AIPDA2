import { ProgramStatus } from "../types/programs";

export function formatDate(date: Date, locale: string = "fr-FR"): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Date invalide";
  }

  const dayName = date.toLocaleDateString(locale, { weekday: "long" });
  const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  const restOfDate = date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
  });

  return `${dayNameCapitalized} ${restOfDate}`;
}

export const getStatutColor = (statut?: ProgramStatus | string): string => {
  switch (statut?.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "in_progress":
      return "bg-sky-100 text-sky-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "terminated":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatutText = (statut?: ProgramStatus | string): string => {
  switch (statut?.toLowerCase()) {
    case "confirmed":
      return "Confirmé";
    case "in_progress":
      return "En cours";
    case "terminated":
      return "Terminé";
    case "cancelled":
      return "Annulé";
    default:
      if (statut) {
        return (
          statut.charAt(0).toUpperCase() + statut.slice(1).replace(/_/g, " ")
        );
      }
      return "Inconnu";
  }
};
