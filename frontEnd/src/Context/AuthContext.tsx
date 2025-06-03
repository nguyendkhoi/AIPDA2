import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Workshop } from "../types/programs";
import { AuthLoginData, AuthSignupData } from "../types/auth";
import { AlertInfo } from "../types/common";
import { User } from "../types/user";

import { loginUser, signupUser, logoutUser } from "../api/auth";

interface AuthContextProps {
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  signupError: string | null;
  setSignupError: (error: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  handleSignup: (data: AuthSignupData) => Promise<void>;
  handleLogin: (data: AuthLoginData) => Promise<void>;
  handleLogout: () => Promise<void>;
  authToken: string | null;
  setAuthToken: (authToken: string | null) => void;
  userWorkshop: Workshop[];
  setUserWorkshop: (workshop: Workshop[]) => void;
  alertInfo: AlertInfo | null;
  setAlertInfo: (alert: AlertInfo | null) => void;
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
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [alertInfo, setAlertInfo] = useState<AlertInfo | null>(null);
  const navigate = useNavigate();

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

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("authToken", loginData.token);

      setAuthToken(loginData.token);
      setUser(userData);

      navigate("/");
      setSignupError(null);
      setAlertInfo({ message: "Login réussi!", type: "success" });
    } catch (error: any) {
      console.error("Error during login:", error);
      let errorMessage = "Une erreur s'est produite lors de la connexion.";
      if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
      setSignupError(errorMessage);
      setAlertInfo({ message: errorMessage, type: "error" });
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
        setAlertInfo({
          message:
            "La confirmation du mot de passe ne correspond pas au mot de passe",
          type: "error",
        });
        return;
      }

      if (!data.role) {
        setSignupError("Veuillez sélectionner un rôle !");
        setAlertInfo({
          message: "Veuillez sélectionner un rôle !",
          type: "info",
        });
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
      const signupResponseData = await signupUser(formDataToSend);

      if (signupResponseData) {
        // Se connecte automatiquement après l'inscription
        await handleLogin({ email: data.email, password: data.password });
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      let errorMessage = error.response.data.detail
        ? error.response.data.detail
        : "Une erreur est survenue lors de l'inscription";
      setSignupError(errorMessage);
      setAlertInfo({ message: errorMessage, type: "error" });
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

        isSaving,
        setIsSaving,
        setAlertInfo,
        alertInfo,
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
