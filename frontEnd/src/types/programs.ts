import { User } from "./user";

export interface ReservationResponse {
  id: number;
  programme: number;
  participant: number;
  date_reservation: string;
  statut: string; // "pending", "confirmed", "cancelled"
  message?: string;
}

export interface WorkshopFormData {
  edition_du_Tour: string;
  name: string;
  theme: string;
  description: string;
  start_date: string; // Consider 'YYYY-MM-DD' string format
  nb_participants_max: number;
}

export interface AnimateurProgrammeAPIResponse {
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

export interface ReservationResponse {
  status?: string;
  message?: string;
  registration_id?: number;
}
