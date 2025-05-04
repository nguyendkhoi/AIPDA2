// mockWorkshops.ts
import { Workshop, User } from "../types"; // Importer Workshop et User

// Créer des workshops factices conformes à l'interface Workshop,
// en utilisant la structure 'animateur: User' pour tous les objets.

// Définir les utilisateurs animateurs pour réutilisation (optionnel mais propre)
const animateurAlice: User = {
  id: "anim-1",
  nom: "Alice Dupont",
  role: "animateur",
};
const animateurBob: User = {
  id: "anim-2",
  nom: "Bob Martin",
  role: "animateur",
};

export const mockWorkshops: Workshop[] = [
  // --- Workshops Passés ---
  {
    id: "ws-001", // ID unique pour le workshop
    animateur: animateurAlice, // Utilise l'objet User directement
    edition_du_Tour: "Avril 2025", // Édition
    nom: "atelier", // Type de programme
    theme: "Principes de base de la conception graphique", // Thème
    title: "Atelier Conception Graphique 101", // Titre spécifique
    description:
      "Introduction aux outils et techniques de conception graphique.", // Description
    nb_participants_max: 15, // Max participants
    nb_participants_actuel: 12, // Participants actuels
    statut: "confirme", // Statut
    createdAt: new Date("2025-03-10T10:00:00Z").toISOString(), // Date de création
    date_de_debut: "2025-04-15", // Date de début
    durationHours: 3, // Durée optionnelle
  },
  {
    id: "ws-002",
    animateur: animateurBob, // <- Corrigé: utilise l'objet User
    edition_du_Tour: "Avril 2025",
    nom: "webinaire",
    theme: "Leadership Collaboratif",
    title: "Webinaire sur le Leadership",
    description: "Développer ses compétences en leadership pour l'ère moderne.",
    nb_participants_max: 50,
    nb_participants_actuel: 45,
    statut: "confirme",
    createdAt: new Date("2025-03-15T11:00:00Z").toISOString(),
    date_de_debut: "2025-04-20",
    durationHours: 1.5,
  },
  // --- Workshops Futurs ---
  {
    id: "ws-003",
    animateur: animateurAlice, // <- Corrigé: utilise l'objet User
    edition_du_Tour: "Avril 2025",
    nom: "talk",
    theme: "Design et Stratégie",
    title: "Talk: Le Design Stratégique",
    description: "Comment intégrer le design dans la stratégie d'entreprise.",
    nb_participants_max: 30,
    nb_participants_actuel: 5,
    statut: "confirme",
    createdAt: new Date("2025-04-01T09:00:00Z").toISOString(),
    date_de_debut: "2025-04-25",
    // durationHours non défini (c'est ok car optionnel)
  },
  {
    id: "ws-004",
    animateur: animateurAlice, // <- Corrigé: utilise l'objet User
    edition_du_Tour: "Juin 2025",
    nom: "atelier",
    theme: "Design Social et Impact Local",
    title: "Atelier Design Social",
    description:
      "Utiliser le design pour résoudre des problèmes sociaux locaux.",
    nb_participants_max: 20,
    nb_participants_actuel: 0,
    statut: "en_attente", // Statut en attente
    createdAt: new Date("2025-04-10T14:30:00Z").toISOString(),
    date_de_debut: "2025-05-05",
    durationHours: 2.5,
  },
  {
    id: "ws-005",
    animateur: animateurBob, // <- Corrigé: utilise l'objet User
    edition_du_Tour: "Juin 2025",
    nom: "webinaire",
    theme: "Communication Interpersonnelle",
    title: "Webinaire Communication Efficace",
    description: "Techniques pour améliorer sa communication au quotidien.",
    nb_participants_max: 100,
    nb_participants_actuel: 15,
    statut: "confirme",
    createdAt: new Date("2025-04-20T10:00:00Z").toISOString(),
    date_de_debut: "2025-05-15",
    durationHours: 1,
  },
];
