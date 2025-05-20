import { User } from "./user";

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

export interface Workshop {
  duration_hours?: number;
  id: string;
  edition_du_Tour: string;
  name: string; // Correspond à `type`
  theme: string; // Correspond à `subtype`
  title: string; // Ajout pour `title`
  description: string; // Ajout pour `description`
  nb_participants_max: number; // Correspond à `max participants`
  nb_participants_actuel: number; // Correspond à `nombre de participants actuel`
  statut: string; // Correspond à `status`
  creation_date: string; // Correspond à `Date de création`
  start_date: string; // Correspond à `Date de début`
  animateur: User;
}

export interface Session {
  id: number;
  date: Date;
  type: ProgramType;
  theme: string | null;
  availableSpots: number;
  currentParticipants: number;
  animateur: {
    id: string;
    name: string;
    photo: string | null;
    role: string;
  };
  description?: string;
  durationHours: string | null;
}

export type Edition = "Avril 2025" | "Juin 2025" | "Août 2025";
