export const formatDate = (dateString: string): string => {
  if (!dateString) return "Date non disponible";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Date invalide";
  }
};

export const getStatutColor = (statut?: string): string => {
  switch (statut?.toLowerCase()) {
    case "confirmed":
    case "approved":
    case "inscrit":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatutText = (statut?: string): string => {
  switch (statut?.toLowerCase()) {
    case "confirmed":
      return "Confirmé";
    case "pending":
      return "En attente";
    case "cancelled":
      return "Annulé";
    case "approved":
      return "Approuvé";
    case "rejected":
      return "Refusé";
    default:
      return statut || "Inconnu";
  }
};
