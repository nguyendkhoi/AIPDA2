import LandingPage from "../components/LandingPage.tsx";
import {useAuth} from "../components/contextApi/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import {useGetCurrentPage} from "../components/Hooks/useGetCurrentPage.tsx";
import {useRedirection} from "../components/Hooks/useRedirection.tsx";

const LandingRoute = () => {
    const { participationType, setParticipationType, setIsSignupModalOpen } = useAuth();
    const {currentPage}=useGetCurrentPage()
    const {redirectTo}=useRedirection()

    return currentPage === '/' && !participationType ? (
        <LandingPage
            onParticipationSelect={(type) => {
                setParticipationType(type);
                redirectTo('programs');
            }}
            onOpenSignup={() => setIsSignupModalOpen(true)}
        />
    ) : (
        <Navigate to="/" replace />
    );
};

export default LandingRoute;