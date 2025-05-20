import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Workshop, Session } from "../types/types";

import { AuthLoginData, AuthSignupData } from "../types/auth";
import { ReservationResponse } from "../types/programs";

import { loginUser, signupUser, logoutUser } from "../api/auth";
import { addParticipantToProgram } from "../api/programs";
import { getUserProfile, updateUserProfile } from "../api/user";

interface AuthContextProps {
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  signupError: string | null;
  setSignupError: (error: string | null) => void;
  user: {
    id: string | number;
    name: string;
    email: string;
    role: string;
    bio: string;
    expertises?: string[];
  } | null;
  setUser: (
    user: {
      id: string | number;
      name: string;
      email: string;
      role: string;
      bio: string;
      expertises?: string[];
    } | null
  ) => void;
  handleSignup: (data: AuthSignupData) => Promise<void>;
  handleLogin: (data: AuthLoginData) => Promise<void>;
  handleLogout: () => Promise<void>;
  authToken: string | null;
  setAuthToken: (authToken: string | null) => void;
  userWorkshop: Workshop[];
  setUserWorkshop: (workshop: Workshop[]) => void;
  handleReservation: (programId: number, onSucces: () => void) => Promise<void>;
  setSelectedProgramForView: (session: Session | null) => void;
  selectedProgramForView: Session | null;
  HandleFetchUserProfile: () => Promise<void>;
  handleUpdateUserProfile: (data: {
    name?: string;
    bio?: string;
    expertises_input?: string[];
  }) => Promise<boolean | void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ---State variables---
  const [authToken, setAuthToken] = useState<string | null>(
    () => localStorage.getItem("authToken") || null
  );
  const [userWorkshop, setUserWorkshop] = useState<Workshop[]>([]);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProgramForView, setSelectedProgramForView] =
    useState<Session | null>(null);
  const [user, setUser] = useState<{
    id: string | number;
    name: string;
    email: string;
    role: string;
    bio: string;
    expertises?: string[];
  } | null>(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // ---Update user profile---
  const handleUpdateUserProfile = async (data: {
    name?: string;
    bio?: string;
    expertises_input?: string[];
  }) => {
    if (!authToken)
      console.error("User not authenticated or ID missing for profile update.");

    try {
      setIsSaving(true);
      const updatedProfileResponse = await updateUserProfile(data);

      setUser((prevUser) => {
        if (!prevUser) return null;
        const updatedProfileUser = {
          ...prevUser,
          name: updatedProfileResponse.name || prevUser.name,
          bio: updatedProfileResponse.bio || prevUser.bio,
          expertises: updatedProfileResponse.expertises || prevUser.expertises,
        };
        localStorage.setItem("userData", JSON.stringify(updatedProfileUser));
        return updatedProfileUser;
      });
      return true;
    } catch (err: any) {
      console.error("Error: ", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ---Fetch user profile---
  const HandleFetchUserProfile = async (): Promise<void> => {
    if (!authToken) {
      console.warn("No auth token found, cannot fetch user profile.");
      setUser(null);
      throw new Error("No auth token found");
    }

    try {
      const profileData = await getUserProfile();
      console.log("User profile fetched:", profileData);

      setUser((prevUser) => {
        if (!prevUser) return null;
        const updatedUser = {
          ...prevUser,
          name: profileData.name || prevUser.name,
          bio: profileData.bio || "",
          expertises: profileData.expertises || [],
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (err: any) {
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
      throw err;
    }
  };

  // ---Login user---
  const handleLogin = async (data: AuthLoginData) => {
    try {
      setSignupError(null);
      const loginData = await loginUser(data);

      const userData = {
        id: loginData.user.id,
        name: loginData.user.name,
        email: loginData.user.email,
        role: loginData.user.role,
        expertises: loginData.user.expertises,
        bio: loginData.user.bio || "",
      };

      console.log("Login data:", loginData);

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("authToken", loginData.token);

      setAuthToken(loginData.token);
      setUser(userData);

      navigate("/");
      setSignupError(null);
    } catch (error: any) {
      console.error("Error during login:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setSignupError(error.response.data.detail);
      } else {
        setSignupError("Une erreur est survenue lors de la connexion");
      }
    }
  };

  // ---Signup user---
  const handleSignup = async (data: AuthSignupData) => {
    try {
      setSignupError(null);
      if (data.password !== data.password2) {
        setSignupError(
          "La confirmation du mot de passe ne correspond pas au mot de passe"
        );
        return;
      }

      if (!data.role) {
        setSignupError("Veuillez sélectionner un rôle !");
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append("first_name", data.first_name);
      formDataToSend.append("name", data.name);
      formDataToSend.append("role", data.role);
      formDataToSend.append("email", data.email);
      formDataToSend.append("telephone", data.telephone || "");
      formDataToSend.append("password", data.password);
      formDataToSend.append("password2", data.password2);

      if (data.pays_residence)
        formDataToSend.append("pays_residence", data.pays_residence);
      if (data.profession) formDataToSend.append("profession", data.profession);
      if (data.organisation)
        formDataToSend.append("organisation", data.organisation);
      if (data.lien_portfolio)
        formDataToSend.append("lien_portfolio", data.lien_portfolio);

      if (data.photo) {
        formDataToSend.append("photo", data.photo, data.photo.name);
      }

      if (data.expertises && data.expertises.length > 0) {
        data.expertises.forEach((expertise, index) => {
          if (expertise.trim() !== "") {
            formDataToSend.append(`expertises[${index}]`, expertise.trim());
          }
        });
      }
      console.log("Form data to send:", formDataToSend);
      const signupResponseData = await signupUser(formDataToSend);

      if (signupResponseData) {
        // Se connecte automatiquement après l'inscription
        await handleLogin({ email: data.email, password: data.password });
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        let errorMessage = "Une erreur est survenue lors de l'inscription.";
        if (backendErrors.email) {
          errorMessage = `Email: ${backendErrors.email.join(", ")}`;
        } else if (backendErrors.password) {
          errorMessage = `Mot de passe: ${backendErrors.password.join(", ")}`;
        }
        setSignupError(errorMessage);
      } else {
        setSignupError(
          error.message || "Une erreur est survenue lors de l'inscription"
        );
      }
    }
  };

  // ---Logout user---
  const handleLogout = async () => {
    await logoutUser();

    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    setUser(null);
    setAuthToken(null);
    navigate("/");
  };

  const handleReservation = async (
    programId: number,
    onSucces?: () => void
  ) => {
    if (!authToken) {
      console.error(
        "L'utilisateur n'est pas authentifié. Impossible de réserver un programme."
      );
      setSignupError("Vous devez être connecté pour réserver.");
      return;
    }

    try {
      await addParticipantToProgram(programId);

      onSucces && onSucces();
      console.log("Réservation réussie !");
      alert("Reservation reussi");
    } catch (error: any) {
      console.error("Error during reservation:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setSignupError(error.response.data.detail);
      } else if (error.message) {
        setSignupError(error.message);
      } else {
        setSignupError("Une erreur est survenue lors de la réservation.");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userWorkshop,
        setUserWorkshop,
        signupError,
        setSignupError,
        handleLogout,
        handleSignup,
        authToken,
        setAuthToken,
        handleLogin,
        handleReservation,
        setSelectedProgramForView,
        selectedProgramForView,
        HandleFetchUserProfile,
        handleUpdateUserProfile,
        isSaving,
        setIsSaving,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
