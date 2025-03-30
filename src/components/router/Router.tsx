import { createBrowserRouter } from "react-router-dom";
import App from "../../App.tsx";
import ProgramsPage from "../ProgramsPage.tsx";
import ProtectedDashboard from "../Proteceted/ProtectedDashboard.tsx";
import DashBoardWrapper from "../../RouteProtected/DashBoardWrapper.tsx";
import ProfileRoute from "../../RouteProtected/ProfileRoute.tsx";
import CommunityRoute from "../../RouteProtected/CommunityRoute.tsx";
import LandingRoute from "../../RouteProtected/LandingRoute.tsx";
import ProgramsDashBoardRoute from "../../RouteProtected/ProgramsDashBoardRoute.tsx";
import Inscription from "../Inscription/Inscription.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingRoute />,
      },
      {
        path: "profile",
        element: <ProfileRoute />,
      },
      {
        path: "dashboard",
        element: <ProtectedDashboard element={<DashBoardWrapper />} />,
      },
      {
        path: "programs",
        element: <ProgramsPage />,
      },
      {
        path: "community",
        element: <CommunityRoute />,
      },
      {
        path: "createPrograms",
        element: <ProgramsDashBoardRoute />,
      },
      {
        path: "inscription",
        element: <Inscription />,
      },
    ],
    errorElement: <p>Erreur 404</p>,
  },
]);
