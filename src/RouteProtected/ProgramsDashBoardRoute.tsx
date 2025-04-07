import {useAuth} from "../components/contextApi/AuthContext.tsx";
import ProgramsDashboard from "../components/ProgramsDashboard.tsx";
import {Navigate} from "react-router-dom";

const ProgramsDashBoardRoute = () => {
    const {participationType} = useAuth()
    console.log("what is participation type ",participationType);
    return participationType === "Animateur" ?
        <ProgramsDashboard/> : <Navigate to={"/"} replace/>
};

export default ProgramsDashBoardRoute;