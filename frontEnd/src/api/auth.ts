import api from "./index";
import {
  AuthLoginData,
  AuthSignupResponse,
  UserDataResponse,
} from "../types/auth";

// Login function
export const loginUser = async (
  data: AuthLoginData
): Promise<UserDataResponse> => {
  const response = await api.post<UserDataResponse>("/login/", data);
  return response.data;
};

// signup function
export const signupUser = async (
  formData: FormData
): Promise<AuthSignupResponse> => {
  const response = await api.post<AuthSignupResponse>(
    "/inscription/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Logout function
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/logout/");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  }
};
