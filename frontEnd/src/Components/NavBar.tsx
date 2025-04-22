import React, { useContext, useEffect, useState } from "react";
import {
  Calendar,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  SquarePlus,
  User,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "./Context/AuthContext.tsx";
import { useRedirection } from "./Hooks/useRedirection.tsx";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, handleLogout } = useAuth();

  const { redirectTo } = useRedirection();
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
                onClick={() => redirectTo("/")}
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                AIPDA
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => redirectTo("/programs")}
                className={`flex items-center transition text-gray-700 hover:text-indigo-600`}
              >
                <Calendar className="inline-block w-4 h-4 mr-1" />
                Programmes
              </button>
              <button
                onClick={() => {}}
                className={`flex items-center transition text-gray-700 hover:text-indigo-600`}
              >
                <Users className="inline-block w-4 h-4 mr-1" />
                Communauté
              </button>
              {user?.role === "animateur" && (
                <button
                  onClick={() => redirectTo("/createPrograms")}
                  className={`flex items-center transition text-gray-700 hover:text-indigo-600`}
                >
                  <SquarePlus className="inline-block w-4 h-4 mr-1" />
                  Créer un programmes
                </button>
              )}

              {user ? (
                <div className="relative">
                  {/*Ajout pour la reservation envoyer le fait d'etre animateur ou Participant*/}

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
                          handleLogout();
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
                    onClick={() => {
                      redirectTo("/connexion");
                    }}
                    className="text-gray-700 hover:text-indigo-600 transition flex items-center"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Se connecter
                  </button>
                  <button
                    onClick={() => {
                      redirectTo("/inscription");
                    }}
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
                        //setShowDashboard(true);
                        redirectTo("/dashboard");
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      DashBoard
                    </button>
                    <button
                      onClick={() => {
                        console.log("Logout clicked");
                        handleLogout();
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
                        //setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded-md"
                    >
                      <LogIn className="inline-block w-4 h-4 mr-1" />
                      Se connecter
                    </button>
                    <button
                      onClick={() => {
                        //onOpenSignup();
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
    </>
  );
};

export default Navbar;
