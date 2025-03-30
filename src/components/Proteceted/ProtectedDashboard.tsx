import {useAuth} from "../contextApi/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import {JSX} from "react";

const ProtectedDashboard = ({element}:{element:JSX.Element}) => {
   const {user,showDashboard} = useAuth();
   return user && showDashboard ? element : <Navigate to={"/"} replace/>
};

export default ProtectedDashboard;