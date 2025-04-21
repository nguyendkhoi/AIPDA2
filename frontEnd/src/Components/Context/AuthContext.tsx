import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "../../types";

const API_BASE_URL = "http://127.0.0.1:8000";

interface AuthContextProps {
  participationType: string | null;
  setParticipationType: (type: string | null) => void;
  signupError: string | null;
  setSignupError: (error: string | null) => void;
  user: { id: string; name: string; email: string } | null;
  setUser: (user: { id: string; name: string; email: string } | null) => void;
  handleSignup: (data: {
    prenom: string;
    nom: string;
    role: string;
    email: string;
    telephone: string;
    password: string;
    password2: string;
    pay?: string;
    profession?: string;
    organisation?: string;
    portfolio?: string;
  }) => Promise<void>;
  handleLogin: (data: { email: string; password: string }) => Promise<void>;
  handleLogout: () => Promise<void>;
  authToken: string | null;
  setAuthToken: (authToken: string | null) => void;
  userSessions: Session[];
  setUserSessions: (sessions: Session[]) => void;
  API_BASE_URL?: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(
    () => localStorage.getItem("authToken") || null
  );
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [participationType, setParticipationType] = useState<string | null>(
    () => localStorage.getItem("participationType") || null
  );
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });
  const navigate = useNavigate();

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
          name: loginData.user.user_metadata.name,
          email: loginData.user.email,
        };

        // Stocke les données de l'utilisateur dans le localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("authToken", loginData.token);
        localStorage.setItem("participationType", loginData.user.role);

        // Met à jour l'état de l'utilisateur et du token
        setParticipationType(loginData.user.role);
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

  const handleSignup = async (data: {
    prenom: string;
    nom: string;
    role: string;
    email: string;
    telephone: string;
    password: string;
    password2: string;
    pay?: string;
    profession?: string;
    organisation?: string;
    portfolio?: string;
  }) => {
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

      const response = await fetch(`${API_BASE_URL}/api/inscription/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

  const handleLogout = async () => {
    const currentToken = authToken;

    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("participationType");

    setUser(null);
    setAuthToken(null);
    setParticipationType(null);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userSessions,
        setUserSessions,
        signupError,
        setSignupError,
        handleLogout,
        handleSignup,
        authToken,
        setAuthToken,
        handleLogin,
        participationType,
        setParticipationType,
        API_BASE_URL,
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
