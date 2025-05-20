import api from "./index";
import { Workshop } from "../types/types";
import {
  WorkshopFormData,
  AnimateurProgrammeAPIResponse,
  ReservationResponse,
} from "../types/programs";

export const getParticipantProgrammes = async (): Promise<
  AnimateurProgrammeAPIResponse[]
> => {
  try {
    const response = await api.get<AnimateurProgrammeAPIResponse[]>(
      "/programme/participant_programmes/"
    );
    return response.data;
  } catch (err: any) {
    console.error("Error fetching participant programs:", err);
    throw err;
  }
};

// Fetch programs for a specific animateur
export const getAnimateurProgrammes = async (): Promise<
  AnimateurProgrammeAPIResponse[]
> => {
  try {
    const response = await api.get<AnimateurProgrammeAPIResponse[]>(
      "/programme/animateur_programmes/"
    );
    return response.data;
  } catch (err: any) {
    console.error("Error fetching animator programs:", err);
    throw err;
  }
};

// Create a new program
export const createProgramme = async (
  data: WorkshopFormData
): Promise<Workshop> => {
  try {
    const response = await api.post<Workshop>("/programme/create/", data);
    return response.data;
  } catch (err: any) {
    console.error("Error creating programme:", err);
    throw err;
  }
};

// Update an existing program
export const updateProgramme = async (
  id: string | number,
  data: Partial<WorkshopFormData>
): Promise<Workshop> => {
  try {
    const response = await api.patch<Workshop>(`/programme/${id}/`, data);
    return response.data;
  } catch (err: any) {
    console.error(`Error updating programme ${id}:`, err);
    throw err;
  }
};

// Delete a programm by id
export const deleteProgramme = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`/programme/${id}/`);
  } catch (err: any) {
    console.error(`Error deleting programme ${id}:`, err);
    throw err;
  }
};

//Reservation function
export const addParticipantToProgram = async (
  programId: number
): Promise<ReservationResponse> => {
  const response = await api.post<ReservationResponse>(
    `/programme/${programId}/add_participant/`
  );
  return response.data;
};

// Fetch all programs
export const getAllPrograms = async (): Promise<Workshop[]> => {
  try {
    const response = await api.get<Workshop[]>("/programme/");
    return response.data;
  } catch (err: any) {
    console.error("Error fetching programs:", err);
    throw err;
  }
};
