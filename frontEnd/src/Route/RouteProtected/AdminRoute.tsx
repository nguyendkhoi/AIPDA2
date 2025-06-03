import { useAuth } from "../../Context/AuthContext.tsx";
import Administrateur from "../../Components/Administrateur/Administrateur.tsx";
import { Navigate } from "react-router-dom";

const AdminRoute = () => {
  const { user } = useAuth();
  return user?.role === "admin" ? (
    <Administrateur />
  ) : (
    <Navigate to={"/"} replace />
  );
};

export default AdminRoute;
