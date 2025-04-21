import { useAuth } from "../Context/AuthContext.tsx";
import ProgramsDashboard from "../ProgramsDashboard.tsx";
import { Navigate } from "react-router-dom";

const ProgramsDashBoardRoute = () => {
  const { participationType } = useAuth();
  console.log("what is participation type ", participationType);
  return participationType === "animateur" ? (
    <ProgramsDashboard />
  ) : (
    <Navigate to={"/"} replace />
  );
};

export default ProgramsDashBoardRoute;
