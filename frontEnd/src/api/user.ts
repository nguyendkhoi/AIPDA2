import api from "./index"; // Instance Axios chung
import {
  UserProfileApiResponse,
  UserRegistrationsResponse,
  UserProposalsResponse,
  UserCommunity,
} from "../types/user";

export const getUserProfile = async (): Promise<UserProfileApiResponse> => {
  const response = await api.get<UserProfileApiResponse>("/user/");
  return response.data;
};

export const updateUserProfile = async (
  data: Partial<UserProfileApiResponse>
): Promise<UserProfileApiResponse> => {
  const response = await api.patch<UserProfileApiResponse>("/user/", data);
  return response.data;
};

export const getUserRegistrations = async (): Promise<
  UserRegistrationsResponse[]
> => {
  const response = await api.get<UserRegistrationsResponse[]>("/registrations");
  return response.data;
};

export const getAnimatorProposals = async (): Promise<
  UserProposalsResponse[]
> => {
  const response = await api.get<UserProposalsResponse[]>(
    "/programme/animateur_programmes"
  );
  return response.data;
};

export const getUserCommunity = async (): Promise<UserCommunity[]> => {
  const response = await api.get<UserCommunity[]>("/user/community");
  return response.data;
};
