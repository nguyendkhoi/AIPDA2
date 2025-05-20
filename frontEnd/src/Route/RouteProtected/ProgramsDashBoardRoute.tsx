import { useAuth } from "../../Context/AuthContext.tsx";
import ProgramsDashboard from "../../Components/ProgramsDashboard/ProgramsDashboard.tsx";
import { Navigate } from "react-router-dom";

const ProgramsDashBoardRoute = () => {
  const { user } = useAuth();
  console.log("what is participation type ", user?.role);
  return user?.role === "animateur" ? (
    <ProgramsDashboard />
  ) : (
    <Navigate to={"/"} replace />
  );
};

export default ProgramsDashBoardRoute;
