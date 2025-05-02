import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Workshop, Session } from "../../types";

const API_BASE_URL = "http://127.0.0.1:8000";

interface AuthContextProps {
  signupError: string | null;
  setSignupError: (error: string | null) => void;
  user: { id: string; name: string; email: string; role: string } | null;
  setUser: (
    user: { id: string; name: string; email: string; role: string } | null
  ) => void;
  handleSignup: (
    data: {
      prenom: string;
      nom: string;
      role: string;
      email: string;
      telephone: string;
      password: string;
      password2: string;
      pays_residence?: string;
      profession?: string;
      organisation?: string;
      lien_portfolio?: string;
    },
    photoFile: File | null
  ) => Promise<void>;
  handleLogin: (data: { email: string; password: string }) => Promise<void>;
  handleLogout: () => Promise<void>;
  authToken: string | null;
  setAuthToken: (authToken: string | null) => void;
  userWorkshop: Workshop[];
  setUserWorkshop: (workshop: Workshop[]) => void;
  API_BASE_URL?: string;
  handleReservation: (programId: number, onSucces: () => void) => Promise<void>;
  setSelectedProgramForView: (session: Session | null) => void;
  selectedProgramForView: Session | null;
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
  const [selectedProgramForView, setSelectedProgramForView] =
    useState<Session | null>(null);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const navigate = useNavigate();

  // ---Login user---
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setSignupError(null);
      const loginResponse = await fetch(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const userData = {
          id: loginData.user.id,
          name: loginData.user.nom,
          email: loginData.user.email,
          role: loginData.user.role,
        };

        console.log("Login data:", loginData);

        // Stocke les données de l'utilisateur dans le localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("authToken", loginData.token);

        // Met à jour l'état de l'utilisateur et du token
        setAuthToken(loginData.token);
        setUser(userData);

        navigate("/");
        setSignupError(null);
      } else {
        console.error("Error during API call:", loginResponse);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setSignupError("Une erreur est survenue lors de la connexion");
    }
  };

  // ---Signup user---
  const handleSignup = async (
    data: {
      prenom: string;
      nom: string;
      role: string;
      email: string;
      telephone: string;
      password: string;
      password2: string;
      pays_residence?: string;
      profession?: string;
      organisation?: string;
      lien_portfolio?: string;
    },
    photoFile: File | null
  ) => {
    // Logique d'inscription similaire à celle décrite précédemment
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

      const formData = new FormData();
      formData.append("prenom", data.prenom);
      formData.append("nom", data.nom);
      formData.append("role", data.role);
      formData.append("email", data.email);
      formData.append("telephone", data.telephone);
      formData.append("password", data.password);
      formData.append("password2", data.password2);

      if (data.pays_residence)
        formData.append("pays_residence", data.pays_residence);
      if (data.profession) formData.append("profession", data.profession);
      if (data.organisation) formData.append("organisation", data.organisation);
      if (data.lien_portfolio)
        formData.append("lien_portfolio", data.lien_portfolio);

      if (photoFile) {
        formData.append("photo", photoFile, photoFile.name);
      }

      const response = await fetch(`${API_BASE_URL}/api/inscription/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Se connecte automatiquement après l'inscription
        await handleLogin({ email: data.email, password: data.password });
      } else {
        console.error("Error during API call:", response);
        const errorMessage = await response.text();
        setSignupError(
          errorMessage ||
            "Une erreur est survenue lors de la connexion après l'inscription"
        );
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      setSignupError(
        error.message || "Une erreur est survenue lors de l'inscription"
      );
    }
    return;
  };

  // ---Logout user---
  const handleLogout = async () => {
    const currentToken = authToken;

    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    setUser(null);
    setAuthToken(null);

    try {
      await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        headers: { Authorization: `Token ${currentToken}` },
      });
    } catch (error) {
      console.error("Error:", error);
    }
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
      return;
    }
    console.log("role utilisateur", user?.role);

    if (user?.role !== "participant") {
      console.error("Seuls les participants peuvent réserver un programme.");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/programme/${programId}/add_participant/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        onSucces && onSucces();
        console.log("Réservation réussie :", data);
        alert("Reservation reussi")
      } else {
        console.error("Error during API call:", response);
        const errorMessage = await response.text();
        setSignupError(
          errorMessage ||
            "Une erreur est survenue lors de la connexion après l'inscription"
        );
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      setSignupError(
        error.message || "Une erreur est survenue lors de l'inscription"
      );
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
        API_BASE_URL,
        handleReservation,
        setSelectedProgramForView,
        selectedProgramForView,
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
