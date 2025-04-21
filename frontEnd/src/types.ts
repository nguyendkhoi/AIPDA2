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
  animateurs: Animateur[];
  description?: string;
  id: string;
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
  animateurId: string; // Correspond à `animator_id`
  animateurNom: string; // Correspond à `animator_name`
  edition: string; // Correspond à `campaign_month`
  program: string; // Correspond à `type`
  theme: string; // Correspond à `subtype`
  title: string; // Ajout pour `title`
  description: string; // Ajout pour `description`
  maxParticipants: number; // Correspond à `max_participants`
  nb_participants_actuel: number; // Correspond à `nb_participants_actuel`
  statut: string; // Correspond à `status`
  createdAt: string; // Correspond à `created_at`
  date_de_debut: string; // Correspond à `start_date`
}

export type Edition = "Avril 2025" | "Juin 2025" | "Août 2025";
