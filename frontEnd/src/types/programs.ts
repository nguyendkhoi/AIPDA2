import { User, DetailedUser } from "./user";

//Type
//====================================================================================================================
export type ProgramStatus =
  | "pending"
  | "confirmed"
  | "terminated"
  | "in_progress"
  | "cancelled";

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

export type Edition = "Avril 2025" | "Juin 2025" | "Août 2025";

//Data Structures
//==============================================================================================
export interface ReservationResponse {
  id: number;
  programme: number;
  participant: number;
  date_reservation: string;
  status: string; // "pending", "confirmed", "cancelled"
  message?: string;
}

export interface WorkshopFormData {
  edition_du_Tour: string;
  title: string;
  name: string;
  theme: string;
  description: string;
  start_date: string;
  nb_participants_max: number;
  status?: string;
}

export interface Campaign {
  month: string;
  weeks: Week[];
}

export interface Week {
  weekNumber: number;
  sessions: Workshop[];
}

export interface Workshop {
  animateur: User;
  id: string;
  edition_du_Tour: string;
  name: string;
  theme: string;
  status?: string;
  title: string;
  description: string;
  nb_participants_max: number;
  current_participant_count: number;
  creation_date: string;
  start_date: string;
  duration_hours?: string | null;
}

export interface DetailedWorkshop {
  animateur: DetailedUser;
  id: string;
  name: string;
  status: string;
  edition_du_Tour: string;
  current_participant_count: Number;
  nb_participants_max: Number;
  duration_hours: string | null;
  theme: string;
  description: string;
  start_date: Date;
  creation_date: Date;
}

export interface Session {
  id: number;
  date: Date;
  type: ProgramType;
  theme: string | null;
  availableSpots: number;
  current_participant_count: number;
  description?: string;
  duration_hours: string | null;
  animateur: User;
}
