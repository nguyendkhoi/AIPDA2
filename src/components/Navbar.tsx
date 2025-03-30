import React, { useEffect, useState } from "react";
import {
  Calendar,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  Presentation,
  SquarePlus,
  User,
  Users,
  X,
} from "lucide-react";
import { PasswordResetModal } from "./PasswordResetModal.tsx";
import { useRedirection } from "./Hooks/useRedirection.tsx";
import { useAuth } from "./contextApi/AuthContext.tsx";

interface NavbarProps {
  user: { name: string; email: string } | null;
  onOpenSignup: () => void;
  currentPage?: "/" | "programs" | "community" | "profile" | string;
  onNavigate?: (page: "landing" | "programs" | "community" | "profile") => void;
  onViewProfile?: () => void;
  onLogout: () => void;
}

const Navbar = ({ user, onOpenSignup, onLogout, currentPage }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const { redirectTo } = useRedirection();
  const {
    setShowDashboard,
    setSelectedSession,
    setParticipationType,
    participationType,
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUserMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const closeUserMenu = () => setIsUserMenuOpen(false);
    document.addEventListener("click", closeUserMenu);
    return () => document.removeEventListener("click", closeUserMenu);
  }, []);

  //Fonction de login pour se connecter via supabase
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // try {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    //   });

    //   if (error) {
    //     if (error.message === "Invalid login credentials") {
    //       console.warn("Email ou mot de passe incorrect");
    //     }
    //     console.warn("erreur ");
    //   }
    //   //normalement on doit mettre -> !data?.user
    //   if (!data.user) {
    //     //throw new Error('Erreur lors de la connexion');
    //     console.warn("Erreur lors de la connexion");
    //   }
    //   setIsLoginModalOpen(false);
    // } catch (e: any) {
    //   console.error("Login error:", e);
    //   setLoginError(
    //     e.message || "Une erreur est survenue lors de la connexion"
    //   );
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => {
                  setParticipationType(null);
                  redirectTo("/");
                }}
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                AIPDA
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => redirectTo("/programs")}
                className={`flex items-center transition ${
                  currentPage?.split("/")[1] === "programs"
                    ? "text-indigo-600"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                <Calendar className="inline-block w-4 h-4 mr-1" />
                Programmes
              </button>
              <button
                onClick={() => redirectTo("/community")}
                className={`flex items-center transition ${
                  currentPage?.split("/")[1] === "community"
                    ? "text-indigo-600"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-1" />
                Communauté
              </button>
              {participationType === "Animateur" && (
                <button
                  onClick={() => redirectTo("/createPrograms")}
                  className={`flex items-center transition ${
                    currentPage?.split("/")[1] === "createPrograms"
                      ? "text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600"
                  }`}
                >
                  <SquarePlus className="inline-block w-4 h-4 mr-1" />
                  Créer un programmes
                </button>
              )}

              {user ? (
                <div className="relative">
                  {/*Ajout pour la reservation envoyer le fait d'etre Animateur ou Participant*/}

                  <button
                    onClick={handleUserMenuClick}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs bg-green-400  px-2 py-1 rounded-full">
                      Connecté
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          redirectTo("/profile");
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Mon profil
                      </button>
                      {/*ici il va falloir verifier si le user est un animateur sinon c'est hidden*/}
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setShowDashboard(true);
                          redirectTo("/dashboard");
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        DashBoard
                      </button>
                      {/*End*/}
                      {/*Reservation*/}

                      <button
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-gray-700 hover:text-indigo-600 transition flex items-center"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Se connecter
                  </button>
                  <button
                    onClick={() => redirectTo("/inscription")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
                  >
                    <User className="w-4 h-4 mr-1" />
                    S'inscrire
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {user && (
                  <div className="px-3 py-2 text-sm text-indigo-600 font-medium border-b border-gray-100 mb-2">
                    Connecté en tant que {user.name}
                  </div>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded-md"
                >
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Programmes
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded-md"
                >
                  <Users className="inline-block w-4 h-4 mr-1" />
                  Communauté
                </button>
                {user ? (
                  <>
                    {/*Profile page*/}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded-md"
                    >
                      <User className="inline-block w-4 h-4 mr-1" />
                      Mon profil
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setShowDashboard(true);
                        redirectTo("/dashboard");
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      DashBoard
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-1" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded-md"
                    >
                      <LogIn className="inline-block w-4 h-4 mr-1" />
                      Se connecter
                    </button>
                    <button
                      onClick={() => {
                        onOpenSignup();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded-md"
                    >
                      <User className="inline-block w-4 h-4 mr-1" />
                      S'inscrire
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modal de connexion */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setLoginError(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connexion</h2>

            {loginError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsPasswordResetModalOpen(true);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Mot de passe oublié ?
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setLoginError(null);
                    onOpenSignup();
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  S'inscrire
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
      {/*Voir pour cette partie */}
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setIsPasswordResetModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
