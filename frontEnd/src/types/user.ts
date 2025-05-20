export interface User {
  id: string;
  name: string;
  first_name?: string;
  role: string;
  photo?: string;
}

export interface UserProfileApiResponse {
  name: string;
  bio: string;
  expertises: string[];
}

export interface UserRegistrationsResponse {
  id: number;
  title: string;
}

export interface UserProposalsResponse {
  id: number;
  name: string;
}

export interface UserCommunity {
  full_name: string;
  photo?: string;
  role: string;
  expertises: string[];
  profession: string;
}
