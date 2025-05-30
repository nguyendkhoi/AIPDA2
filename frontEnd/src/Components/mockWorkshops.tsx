// mockWorkshops.ts
import { Workshop } from "../types/programs"; // Importer Workshop et User
import { User } from "../types/user"; // Importer User
// Créer des workshops factices conformes à l'interface Workshop,
// en utilisant la structure 'animateur: User' pour tous les objets.

// Définir les utilisateurs animateurs pour réutilisation (optionnel mais propre)
const animateurAlice: User = {
  name: "Alice Dupont",
  role: "animateur",
};
const animateurBob: User = {
  name: "Bob Martin",
  role: "animateur",
};

export const mockWorkshops: Workshop[] = [
  // --- Workshops Passés ---
  {
    id: "ws-001",
    animateur: animateurAlice,
    edition_du_Tour: "Avril 2025",
    name: "atelier",
    theme: "Principes de base de la conception graphique",
    title: "Atelier Conception Graphique 101",
    description:
      "Introduction aux outils et techniques de conception graphique.",
    nb_participants_max: 15,
    current_participant_count: 12,
    status: "confirme",
    creation_date: new Date("2025-03-10T10:00:00Z").toISOString(),
    start_date: "2025-12-15",
    duration_hours: 3,
  },
  {
    id: "ws-002",
    animateur: animateurBob, // <- Corrigé: utilise l'objet User
    edition_du_Tour: "Avril 2025",
    name: "webinaire",
    theme: "Leadership Collaboratif",
    title: "Webinaire sur le Leadership",
    description: "Développer ses compétences en leadership pour l'ère moderne.",
    nb_participants_max: 50,
    current_participant_count: 45,
    status: "confirme",
    creation_date: new Date("2025-03-15T11:00:00Z").toISOString(),
    start_date: "2025-04-20",
    duration_hours: 1.5,
  },
  // --- Workshops Futurs ---
  {
    id: "ws-003",
    animateur: animateurAlice, // <- Corrigé: utilise l'objet User
    edition_du_Tour: "Avril 2025",
    name: "talk",
    theme: "Design et Stratégie",
    title: "Talk: Le Design Stratégique",
    description: "Comment intégrer le design dans la stratégie d'entreprise.",
    nb_participants_max: 30,
    current_participant_count: 5,
    status: "confirme",
    creation_date: new Date("2025-04-01T09:00:00Z").toISOString(),
    start_date: "2025-04-25",
    // duration_hours non défini (c'est ok car optionnel)
  },
  {
    id: "ws-004",
    animateur: animateurAlice,
    edition_du_Tour: "Juin 2025",
    name: "atelier",
    theme: "Design Social et Impact Local",
    title: "Atelier Design Social",
    description:
      "Utiliser le design pour résoudre des problèmes sociaux locaux.",
    nb_participants_max: 20,
    current_participant_count: 0,
    status: "en_attente",
    creation_date: new Date("2025-07-10T14:30:00Z").toISOString(),
    start_date: "2025-05-05",
    duration_hours: 2.5,
  },
  {
    id: "ws-005",
    animateur: animateurBob,
    edition_du_Tour: "Juin 2025",
    name: "webinaire",
    theme: "Communication Interpersonnelle",
    title: "Webinaire Communication Efficace",
    description: "Techniques pour améliorer sa communication au quotidien.",
    nb_participants_max: 100,
    current_participant_count: 15,
    status: "confirme",
    creation_date: new Date("2025-04-20T10:00:00Z").toISOString(),
    start_date: "2025-05-15",
    duration_hours: 1,
  },
];
