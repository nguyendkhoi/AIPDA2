import ProfilePage from "../components/ProfilePage.tsx";
import {useAuth} from "../components/contextApi/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import {useGetCurrentPage} from "../components/Hooks/useGetCurrentPage.tsx";

const ProfileRoute = () => {
    const { user, participationType, handleLogout} = useAuth();
    const {currentPage}=useGetCurrentPage()
    console.log(`je suis dans le Profiles Route user:`,{user});
    return currentPage.split("/")[1] === 'profile' && user && participationType ? (
        <ProfilePage user={user} participationType={participationType} onLogout={handleLogout} />
    ) : (
        <Navigate to="/" replace />
    );
};

export default ProfileRoute;