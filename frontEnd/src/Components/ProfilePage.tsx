import React from "react";
import { Award, Calendar, Edit2, Loader2, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import participants from "../assets/icons/participants.svg";

const ProfilePage = () => {
  const { authToken, API_BASE_URL, setUser, user, handleLogout } = useAuth();

  const [name, setName] = useState(user?.name || "Utilisateur");
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string>();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Effet pour charger les données utilisateur lorsque l'ID utilisateur change (ou au montage si user est défini)
  useEffect(() => {
    // Vérifier si l'utilisateur existe avant de lancer le fetch
    if (user?.id) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fonction asynchrone pour récupérer les données de l'utilisateur depuis le backend
  const fetchUserData = async () => {
    // Vérification supplémentaire de l'ID utilisateur
    if (!user?.id) {
      console.error("fetchUserData called without user ID.");
      setError("Impossible de charger les données: ID utilisateur manquant.");
      setIsLoading(false);
      return;
    }

    console.log("Fetching user data for user ID:", user.id);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/`, {
        method: "GET",
        headers: { Authorization: `Token ${authToken}` },
      });

      if (!response.ok) throw new Error("Erreur réseau");

      const userData = await response.json();

      // Mettre à jour les états avec les données reçues du backend
      setName(userData.name);
      setBio(userData.bio || "");
      setExpertise(userData.expertise || []);

      // Charger les inscriptions OU les propositions selon le type de participation
      if (user.role === "participant") {
        const regsResponse = await fetch(`${API_BASE_URL}/api/registrations`, {
          method: "GET",
          headers: { Authorization: `Token ${authToken}` },
        });
        const regsData2 = await regsResponse.json();
        setRegistrations(
          null || [
            {
              id: "reg1",
              programs: {
                nom: "Programme 1",
                edition_du_Tour: "Avril 2025",
                date_de_debut: new Date(Date.now() - 86400000).toISOString(),
              },
              statut: "confirmed",
              date_inscription: new Date().toISOString(),
            },
          ]
        );
      } else {
        const propsResponse = await fetch(
          `${API_BASE_URL}/api/programme/animateur_programmes`
        );
        const propsData = await propsResponse.json();
        setProposals(propsData || []);
      }

      // --- Fin de la section à remplacer par l'appel à votre API backend ---
    } catch (err) {
      console.error("Error fetching user data from backend:", err);
      // Utiliser instanceof Error pour une meilleure gestion des types d'erreur
      if (err instanceof Error) {
        setError(`Erreur lors du chargement des données: ${err.message}`);
      } else {
        setError("Erreur inconnue lors du chargement des données");
      }
    } finally {
      setIsLoading(false); // Arrêter l'indicateur de chargement dans tous les cas
    }
  };

  // Fonction pour gérer la mise à jour du profil utilisateur
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher le rechargement de la page par le formulaire

    // Vérification de l'ID utilisateur
    if (!user?.id) {
      console.error("handleUpdateProfile called without user ID.");
      setError("Impossible de mettre à jour: ID utilisateur manquant.");
      return;
    }

    setIsSaving(true); // Activer l'indicateur de sauvegarde
    setError(null);

    try {
      // Préparer les données à envoyer
      const updatedProfileData = {
        nom: name,
        bio,
        expertises: expertise,
      };

      const response = await fetch(`${API_BASE_URL}/api/user/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(updatedProfileData),
      });
      if (!response.ok) {
        const errorData = await response.json(); // Essayer de récupérer les détails de l'erreur
        throw new Error(errorData.message || "Erreur lors de la mise à jour");
      }

      // Simuler une attente réseau
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Simulating profile update with data:", updatedProfileData);

      // --- Fin de la section à remplacer par l'appel à votre API backend ---
      setUser({ ...user, name: updatedProfileData.nom || user.name }); // Mettre à jour le contexte utilisateur
      setIsEditing(false); // Quitter le mode édition après succès
      // Recharger les données pour afficher les informations à jour
      // Il est important que fetchUserData récupère les données fraîchement mises à jour par le backend
      await fetchUserData();
    } catch (err) {
      console.error("Error updating profile via backend:", err);
      if (err instanceof Error) {
        setError(`Erreur lors de la mise à jour du profil: ${err.message}`);
      } else {
        setError("Erreur inconnue lors de la mise à jour du profil");
      }
    } finally {
      setIsSaving(false); // Désactiver l'indicateur de sauvegarde dans tous les cas
    }
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    // Ajouter une vérification si dateString est valide
    if (!dateString) return "Date non disponible";
    try {
      const date = new Date(dateString);
      // Vérifier si la date est valide après la conversion
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const formattedDay = String(day).padStart(2, "0");
      const formattedMonth = String(month).padStart(2, "0");

      return `${formattedDay}-${formattedMonth}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Date invalide";
    }
  };

  // Fonction pour déterminer la couleur de fond et de texte en fonction du statut
  const getstatutColor = (statut: string) => {
    switch (
      statut?.toLowerCase() // Utiliser toLowerCase pour être insensible à la casse
    ) {
      case "confirmed":
      case "approved":
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

  // Fonction pour traduire le statut en texte français
  const getstatutText = (statut: string) => {
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
        // Retourner le statut tel quel s'il n'est pas reconnu, ou une chaîne vide/par défaut
        return statut || "Inconnu";
    }
  };

  // Affichage pendant le chargement des données
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-gray-600">Chargement du profil...</span>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas chargé (ou est null), afficher un message ou rediriger
  // C'est une sécurité supplémentaire au cas où le useEffect n'aurait pas pu charger les données
  if (!user) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">
            {error ||
              "Impossible d'afficher le profil. Utilisateur non chargé."}
          </p>
          {/* Optionnel: Bouton pour réessayer ou retourner à l'accueil */}
        </div>
      </div>
    );
  }

  // Rendu principal du composant
  return (
    <>
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Affichage d'une erreur globale si elle existe */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* En-tête du profil */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{name}</h1>
                  {/* Afficher l'email de l'utilisateur (vient de la prop user) */}
                  <p className="text-indigo-100">
                    {user.email || "Email non disponible"}
                  </p>
                  {/* Afficher le type de participation */}
                  <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-indigo-500/50 text-sm">
                    {user.role || "Type non défini"}
                  </span>
                </div>
                <div className="flex gap-2">
                  {/* Bouton pour passer en mode édition */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition"
                    title="Modifier le profil"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  {/* Bouton de déconnexion (si la fonction handleLogout est fournie) */}
                  {handleLogout && (
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition"
                      title="Se déconnecter"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Contenu du profil */}
            <div className="p-6">
              {/* Affichage du formulaire d'édition OU des informations du profil */}
              {isEditing ? (
                // Formulaire d'édition
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biographie
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>

                  {/* Champ pour l'expertise */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expertise (séparées par des virgules)
                    </label>
                    {/* Affichage des tags d'expertise actuels */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {expertise}
                      </span>
                    </div>
                    {/* Input pour modifier les expertises */}
                    <input
                      type="text"
                      // Rejoindre le tableau en chaîne pour l'input, séparé par ", "
                      value={expertise}
                      onChange={(e) =>
                        // Séparer la chaîne par ",", enlever les espaces autour (trim)
                        setExpertise(e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: UX Design, UI Design, Design System"
                    />
                  </div>

                  {/* Boutons d'action du formulaire */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSaving} // Désactiver pendant la sauvegarde
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        "Enregistrer les modifications"
                      )}
                    </button>
                    <button
                      type="button"
                      // Annuler repasse isEditing à false
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      disabled={isSaving} // Désactiver pendant la sauvegarde
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                // Affichage des informations du profil (mode non-édition)
                <div className="space-y-8">
                  {/* Section "À propos" */}
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-600" />À propos
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 mb-4">
                        {/* Afficher la bio ou un message par défaut */}
                        {bio || "Aucune biographie renseignée"}
                      </p>
                      {/* Afficher les expertises si elles existent */}
                      {expertise && expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {expertise}
                          </span>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Section "Activités" (Inscriptions ou Propositions) */}
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      {/* Titre et icône dynamique selon le type de participation */}
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
                          registrations.map((reg) => (
                            <div
                              key={reg.id}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {/* Utiliser optional chaining au cas où programs serait manquant */}
                                    {reg.programs?.nom || "Titre indisponible"}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {reg.programs?.edition_du_Tour}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-2">
                                    {formatDate(reg.programs?.date_de_debut) ||
                                      "Type inconnu"}
                                  </p>
                                </div>
                                <span
                                  // Affichage du statut avec couleur dynamique
                                  className={`px-3 py-1 rounded-full text-sm ${getstatutColor(
                                    reg.statut
                                  )}`}
                                >
                                  {getstatutText(reg.statut)}
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
                                  Proposé le {formatDate(prop.date_de_creation)}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                  {prop.theme || "Type inconnu"}{" "}
                                  {/* Afficher le sous-type s'il existe */}
                                  {prop.subtype && `- ${prop.subtype}`}
                                </p>
                              </div>
                              <div>
                                <p // Affichage du statut avec couleur dynamique
                                  className={`flex justify-center px-3 py-1 rounded-full text-sm ${getstatutColor(
                                    prop.statut
                                  )}`}
                                >
                                  {getstatutText(prop.statut)}
                                </p>
                                <p
                                  className={`inline-flex px-3 py-1 rounded-full text-sm mt-2 bg-gray-100`}
                                >
                                  <img src={participants} />
                                  {prop.nb_participants_actuel} /{" "}
                                  {prop.nb_participants_max}{" "}
                                </p>
                              </div>
                            </div>
                            <p className="mt-3 text-gray-600 border-t pt-3">
                              {prop.description || "Pas de description"}
                            </p>
                            {/* Afficher les dates souhaitées si elles existent */}
                            {prop.preferred_dates &&
                              prop.preferred_dates.length > 0 && (
                                <div className="mt-3 text-sm text-gray-500">
                                  <strong>Dates souhaitées :</strong>
                                  <ul className="list-disc list-inside mt-1">
                                    {/* Utiliser les types explicites pour date et index */}
                                    {prop.preferred_dates.map(
                                      (date: string, index: number) => (
                                        <li key={index}>{formatDate(date)}</li>
                                      )
                                    )}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
