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
  sessions: Session[];
}

export interface Session {
  date: Date;
  type: ProgramType;
  subType?: AtelierType | TalkType | GlobalType;
  theme?: string;
  availableSpots: number;
  participants: Participant[];
  animateurs: Animateur[];
  description?: string;
  id: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  type: ParticipationType;
}

export interface Animateur {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
}

export interface Workshop {
  id: string;
  animatorId: string; // Correspond à `animator_id` dans Supabase
  edition: string; // Correspond à `campaign_month` dans Supabase
  program: string; // Correspond à `type` dans Supabase
  theme: string; // Correspond à `subtype` dans Supabase
  title: string; // Ajout pour `title`
  description: string; // Ajout pour `description`
  preferredDates: string[]; // Correspond à `preferred_dates` (tableau de timestamps)
  date: string; // Correspond à `session_date` dans Supabase
  weekNumber: number; // Correspond à `week_number`
  maxParticipants: number; // Correspond à `max_participants`
  status: string; // Correspond à `status`
  createdAt: string; // Correspond à `created_at`
  updatedAt: string; // Correspond à `updated_at`
}

export type Edition = "Avril 2025" | "Juin 2025" | "Août 2025";
