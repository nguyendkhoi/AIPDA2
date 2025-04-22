// mockWorkshops.ts
import { Workshop, ProgramType } from "../types"; // Importer Workshop et ProgramType

// Note: Pas besoin d'importer Animateur ici car Workshop utilise animateurNom (string)

// Créer des workshops factices conformes à l'interface Workshop
export const mockWorkshops: Workshop[] = [
  // --- Workshops Passés ---
  {
    id: "ws-001", // ID unique pour le workshop
    animateurId: "anim-1", // ID de l'animateur (supposé)
    animateurNom: "Alice Dupont", // Nom unique de l'animateur
    edition_du_Tour: "Avril 2025", // Édition
    nom: "atelier", // Type de programme (correspond à ProgramType, souvent en minuscule)
    theme: "Principes de base de la conception graphique", // Thème (peut combiner type/thème original)
    title: "Atelier Conception Graphique 101", // Titre spécifique
    description:
      "Introduction aux outils et techniques de conception graphique.", // Description (obligatoire)
    nb_participants_max: 15, // Max participants
    nb_participants_actuel: 12, // Participants actuels (exemple)
    statut: "confirme", // Statut (ex: 'confirme', 'en_attente', 'annule')
    createdAt: new Date("2025-03-10T10:00:00Z").toISOString(), // Date de création (string ISO)
    date_de_debut: "2025-04-15", // Date de début (string YYYY-MM-DD)
    durationHours: 3, // Durée optionnelle
  },
  {
    id: "ws-002",
    animateurId: "anim-2",
    animateurNom: "Bob Martin",
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
    animateurId: "anim-1",
    animateurNom: "Alice Dupont",
    edition_du_Tour: "Avril 2025", // Peut être la même édition
    nom: "talk",
    theme: "Design et Stratégie",
    title: "Talk: Le Design Stratégique",
    description: "Comment intégrer le design dans la stratégie d'entreprise.",
    nb_participants_max: 30,
    nb_participants_actuel: 5, // Peu de participants pour l'instant
    statut: "confirme",
    createdAt: new Date("2025-04-01T09:00:00Z").toISOString(),
    date_de_debut: "2025-04-25",
    // durationHours non défini
  },
  {
    id: "ws-004",
    animateurId: "anim-1", // Workshop n'a qu'un animateur principal
    animateurNom: "Alice Dupont", // Même si 2 animateurs étaient prévus pour la session
    edition_du_Tour: "Juin 2025",
    nom: "atelier",
    theme: "Design Social et Impact Local",
    title: "Atelier Design Social",
    description:
      "Utiliser le design pour résoudre des problèmes sociaux locaux.",
    nb_participants_max: 20,
    nb_participants_actuel: 0, // Aucun participant encore
    statut: "en_attente", // Statut en attente
    createdAt: new Date("2025-04-10T14:30:00Z").toISOString(),
    date_de_debut: "2025-05-05",
    durationHours: 2.5,
  },
  {
    id: "ws-005",
    animateurId: "anim-2",
    animateurNom: "Bob Martin",
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
