export interface AuthLoginData {
  email: string;
  password: string;
}

export interface AuthSignupData {
  name: string;
  first_name: string;
  email: string;
  password: string;
  password2: string;
  photo?: File | null;
  role: string;
  telephone?: string;
  pays_residence?: string;
  profession?: string;
  organisation?: string;
  lien_portfolio?: string;
  expertises?: string[];
}

export interface UserDataResponse {
  user: {
    id: number;
    name: string;
    first_name: string;
    email: string;
    photo: string | null;
    role: string;
    bio?: string;
    profession?: string;
    expertises?: string[];
  };
  token: string;
}
