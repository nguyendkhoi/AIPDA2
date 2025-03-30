import React, { createContext, useContext, useEffect, useState } from "react";
import { ParticipationType, Session } from "../../types"; // Assure-toi d'importer les types nécessaires
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthContextProps {
  participationType: ParticipationType | null;
  setParticipationType: (type: ParticipationType | null) => void;
  selectedCampaign: number;
  setSelectedCampaign: (campaign: number) => void;
  isSignupModalOpen: boolean;
  setIsSignupModalOpen: (isOpen: boolean) => void;
  selectedSession: Session | null;
  setSelectedSession: (session: Session | null) => void;
  selectedProgramForView: Session | null;
  setSelectedProgramForView: (session: Session | null) => void;
  user: { id: string; name: string; email: string } | null;
  setUser: (user: { id: string; name: string; email: string } | null) => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
  userSessions: Session[];
  setUserSessions: (sessions: Session[]) => void;
  signupError: string | null;
  setSignupError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
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
  // handleReservation: (data: {
  //   message: string;
  //   programType?: string;
  //   subType?: string;
  // }) => Promise<void>;
  handleLogout: () => Promise<void>;
  authToken: string | null;
  setAuthToken: (authToken: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [participationType, setParticipationType] =
    useState<ParticipationType | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState(0);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedProgramForView, setSelectedProgramForView] =
    useState<Session | null>(null);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     // Vérifie si session est bien récupérée
  //     if (session?.user) {
  //       fetchUserProfile(
  //         session.user.id,
  //         session.user.user_metadata.email,
  //         session.user.user_metadata?.name,
  //         session.user.user_metadata?.role
  //       );
  //     }
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     // Vérifie si l'état de session change bien
  //     if (session?.user) {
  //       fetchUserProfile(
  //         session.user.id,
  //         session.user.user_metadata.email,
  //         session.user.user_metadata?.name,
  //         session.user.user_metadata?.role
  //       );
  //     } else {
  //       setUser(null);
  //       navigate("/");
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  // const fetchUserProfile = async (
  //   userId: string,
  //   email: string,
  //   name: string,
  //   role: string
  // ) => {
  //   try {
  //     const { data: profile, error } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", userId)
  //       .single();
  //     if (error && error.code === "PGRST116") {
  //       await supabase
  //         .from("profiles")
  //         .insert({ id: userId, email, name, role });
  //     }
  //     if (profile) {
  //       setUser({ id: userId, name: profile.name, email: profile.email });
  //       setParticipationType(profile.role as ParticipationType);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user profile:", error);
  //     setUser(null);
  //   }
  // };

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
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
        console.log("loginData", loginData);
        setUser({
          id: loginData.user.id,
          name: loginData.user.user_metadata.name,
          email: loginData.user.email,
        });
        setAuthToken(loginData.token);
        navigate("/");
        setSignupError(null);
        // if (selectedSession) {
        //   handleReservation({ message: "" });
        // }
      } else {
        console.error("Error during API call:", loginResponse);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setSignupError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      setSignupError(null);
      //Avant
      // Vérifie d'abord si l'utilisateur existe
      /* const { data: existingUser } = await supabase.auth.signInWithPassword({
               email: data.email,
               password: data.password,
             }); */

      /* if (existingUser.user) {
               setSignupError('Un compte existe déjà avec cet email. Veuillez vous connecter.');
               setIsLoading(false);
               return;
             }*/
      //Après
      if (data.password !== data.password2) {
        setSignupError(
          "La confirmation du mot de passe ne correspond pas au mot de passe"
        );
        setIsLoading(false);
        return;
      }

      if (!data.role) {
        setSignupError("Veuillez sélectionner un rôle !");
        setIsLoading(false);
        ``;
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/inscription/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Vérifie si la réponse est correcte
      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        // Se connecte automatiquement après l'inscription
        handleLogin({ email: data.email, password: data.password });
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

    setIsLoading(false);
    return;
  };

  // const handleReservation = async (data: {
  //   message: string;
  //   programType?: string;
  //   subType?: string;
  // }) => {
  //   // Logique de réservation
  //   if (!user || !selectedSession) return;

  //   try {
  //     if (participationType === "Participant") {
  //       const { error } = await supabase.from("registrations").insert({
  //         program_id: selectedSession.id,
  //         user_id: user.id,
  //         message: data.message,
  //         status: "confirmed",
  //       });

  //       if (error) throw error;
  //     } else {
  //       const { error } = await supabase.from("program_proposals").insert({
  //         animator_id: user.id,
  //         type: data.programType as any,
  //         subtype: data.subType,
  //         title: selectedSession.theme || "",
  //         description: data.message,
  //         preferred_dates: [selectedSession.date],
  //         status: "pending",
  //       });

  //       if (error) throw error;
  //     }

  //     setUserSessions([...userSessions, selectedSession]);
  //     setSelectedSession(null);
  //     setShowDashboard(true);
  //   } catch (error) {
  //     console.error("Error during reservation:", error);
  //   }
  // };

  const handleLogout = async () => {
    // await supabase.auth.signOut();
    setUser(null);
    navigate("/");
    setParticipationType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        participationType,
        setParticipationType,
        selectedCampaign,
        setSelectedCampaign,
        isSignupModalOpen,
        setIsSignupModalOpen,
        selectedSession,
        setSelectedSession,
        selectedProgramForView,
        setSelectedProgramForView,
        user,
        setUser,
        showDashboard,
        setShowDashboard,
        userSessions,
        setUserSessions,
        signupError,
        setSignupError,
        isLoading,
        setIsLoading,
        // handleReservation,
        handleLogout,
        handleSignup,
        authToken,
        setAuthToken,
        handleLogin,
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
