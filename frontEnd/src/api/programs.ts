import api from "./index";
import {
  WorkshopFormData,
  Workshop,
  ReservationResponse,
  DetailedWorkshop,
} from "../types/programs";

export const getParticipantProgrammes = async (): Promise<Workshop[]> => {
  try {
    const response = await api.get<Workshop[]>(
      "/programme/participant_programmes/"
    );
    return response.data;
  } catch (err: any) {
    console.error("Error fetching participant programs:", err);
    throw err;
  }
};

// Fetch programs for a specific animateur
export const getAnimateurProgrammes = async (): Promise<Workshop[]> => {
  try {
    const response = await api.get<Workshop[]>(
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
): Promise<Boolean> => {
  try {
    const response = await api.post<Boolean>("/programme/create/", data);
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
): Promise<Boolean> => {
  try {
    const response = await api.patch<Boolean>(`/programme/${id}/`, data);
    return response.data;
  } catch (err: any) {
    console.error(`Error updating programme ${id}:`, err);
    throw err;
  }
};

// Delete a programm by id
export const deleteProgramme = async (
  id: string | number
): Promise<Boolean> => {
  try {
    await api.delete<Boolean>(`/programme/${id}/`);
    return true;
  } catch (err: any) {
    console.error(`Error deleting programme ${id}:`, err);
    throw err;
  }
};

// Reservation function
export const addParticipantToProgram = async (
  programId: number
): Promise<ReservationResponse> => {
  const response = await api.post<ReservationResponse>(
    `/programme/${programId}/registrations/`
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

// Fetch Programs For Admin
export const fetchDetailedProgram = async (): Promise<DetailedWorkshop[]> => {
  try {
    const response = await api.get<DetailedWorkshop[]>(
      "/programme/admin/detailed/"
    );
    return response.data;
  } catch (err: any) {
    console.error("Error fetching programs:", err);
    throw err;
  }
};
