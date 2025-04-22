export type ProgramType = "Webinaire" | "Atelier" | "Talk";

export type AtelierType =
  | "Atelier de conception graphique"
  | "Atelier de Design de marque"
  | "Atelier de Design social";

export type TalkType =
  | "Le design au service des styles"
  | "Le design au service des processus"
  | "Le design au services des stratégies";

export type GlobalType =
  | "Design Thinking"
  | "Agilité"
  | "Innovation"
  | "Leadership"
  | "Communication";

export type ParticipationType = "Animateur" | "Participant";

export interface Campaign {
  month: string;
  weeks: Week[];
}

export interface Week {
  weekNumber: number;
  sessions: Workshop[];
}

interface User {
  id: string;
  nom: string;
  role: string;
  photo?: string;
}

export interface Workshop {
  durationHours?: number;
  id: string;
  edition_du_Tour: string; // Correspond à `campaign_month`
  nom: string; // Correspond à `type`
  theme: string; // Correspond à `subtype`
  title: string; // Ajout pour `title`
  description: string; // Ajout pour `description`
  nb_participants_max: number; // Correspond à `max_participants`
  nb_participants_actuel: number; // Correspond à `nb_participants_actuel`
  statut: string; // Correspond à `status`
  createdAt: string; // Correspond à `created_at`
  date_de_debut: string; // Correspond à `start_date`
  animateur: User;
}

export interface Session {
  id: number;
  date: Date;
  type: ProgramType;
  theme: string | null;
  availableSpots: number;
  currentParticipants: number;
  animateur: User;
  description?: string;
  durationHours: string | null;
}

export type Edition = "Avril 2025" | "Juin 2025" | "Août 2025";
