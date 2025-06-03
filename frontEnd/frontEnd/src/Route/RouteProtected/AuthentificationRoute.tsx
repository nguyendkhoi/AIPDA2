import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.tsx";

const AuthentificationRoute = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthentificationRoute;
