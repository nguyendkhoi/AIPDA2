import ProfilePage from "../ProfilePage.tsx";
import { useAuth } from "../Context/AuthContext.tsx";
import { Navigate } from "react-router-dom";

const ProfileRoute = () => {
  const { user } = useAuth();
  if (user) {
    return <ProfilePage />;
  }
  return <Navigate to="/" replace />;
};

export default ProfileRoute;
