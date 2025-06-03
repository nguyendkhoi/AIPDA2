export interface User {
  name: string;
  first_name?: string;
  role: string;
  photo?: string;
}

export interface DetailedUser {
  id: string | number;
  email: string;
  first_name: string;
  name: string;
  role: string;
  telephone: string;
  photo?: string;
  pays_residence: string;
  bio?: string;
  expertises?: string[];
  profession: string;
  organisation: string;
  lien_portfolio: string;
  creation_date: Date;
}

export interface UserProfileApiResponse {
  name?: string;
  first_name?: string;
  bio?: string;
  expertises?: string[];
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
