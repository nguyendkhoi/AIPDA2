import CommunityPage from "../components/CommunityPage.tsx";
import {useAuth} from "../components/contextApi/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import {useGetCurrentPage} from "../components/Hooks/useGetCurrentPage.tsx";
//import {useRedirection} from "../components/Hooks/useRedirection.tsx";

const CommunityRoute = () => {
    const {setParticipationType, setIsSignupModalOpen } = useAuth();
    const {currentPage}=useGetCurrentPage()

    console.log("current page is here",currentPage)
    return currentPage.split('/')[1] === 'community' ? (
        <CommunityPage
            onParticipationSelect={(type) => {
                setParticipationType(type);
            }}
            onOpenSignup={() => setIsSignupModalOpen(true)}
        />
    ) : (
        <Navigate to="/" replace />
    );
};

export default CommunityRoute;