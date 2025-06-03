import DashBoard from "../../Components/DashBoard.tsx";
import { useAuth } from "../../Context/AuthContext.tsx";
import { Navigate } from "react-router-dom";

const DashBoardRoute = () => {
  const { user } = useAuth();
  if (user) {
    return <DashBoard />;
  }
  return <Navigate to="/" replace />;
};

export default DashBoardRoute;
