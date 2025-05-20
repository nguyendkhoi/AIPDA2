import CommunityPage from "../../Components/Communaute/CommutyPages.tsx";
import { Navigate } from "react-router-dom";
import { useGetCurrentPage } from "../../Hooks/useGetCurrentPage.tsx";
//import {useRedirection} from "../components/Hooks/useRedirection.tsx";

const CommunityRoute = () => {
  const { currentPage } = useGetCurrentPage();

  console.log("current page is here", currentPage);
  return currentPage.split("/")[1] === "community" ? (
    <CommunityPage />
  ) : (
    <Navigate to="/" replace />
  );
};

export default CommunityRoute;
