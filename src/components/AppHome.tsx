import {Outlet} from "react-router-dom";
import {useAuth} from "./contextApi/AuthContext.tsx";
import Navbar from "./Navbar.tsx";
import SignupModal from "./SignupModal.tsx";
import ReservationModal from "./ReservationModal.tsx";
import {ProgramModal} from "./ProgramModal.tsx";
import {useRedirection} from "./Hooks/useRedirection.tsx";



function AppHome() {
    const {
        isSignupModalOpen,
        setIsSignupModalOpen,
        signupError,
        setSignupError,
        handleSignup,
        isLoading,
        selectedSession,
        setSelectedSession,
        handleReservation,
        selectedProgramForView,
        setSelectedProgramForView,
        participationType,
        user,
        handleLogout
    } = useAuth();

    const {redirectTo}=useRedirection()
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
                <Navbar
                     user={user}
                     onOpenSignup={() => setIsSignupModalOpen(true)}
                     onViewProfile={() => redirectTo('profile')}
                     onLogout={handleLogout}
                />
                <main>
                    <Outlet/>
                </main>
                <>
                    {/* Modale d'inscription globale */}
                    <SignupModal
                        isOpen={isSignupModalOpen}
                        onClose={() => {
                            setIsSignupModalOpen(false);
                            setSignupError(null);
                            redirectTo('programs');
                        }}
                        onSubmit={handleSignup}
                        error={signupError}
                        isLoading={isLoading}
                    />

                    {/* Modale de réservation globale */}
                    {selectedSession && participationType && (
                        <ReservationModal
                            isOpen={true}
                            onClose={() => setSelectedSession(null)}
                            onSubmit={handleReservation}
                            session={selectedSession}
                            participationType={participationType}
                        />
                    )}

                    {/*Program view */}
                    {selectedProgramForView && (
                        <ProgramModal
                            isOpen={true}
                            onClose={() => setSelectedProgramForView(null)}
                            session={selectedProgramForView}
                        />
                    )}
                </>
            </div>

        </>
    )
}

export default AppHome
