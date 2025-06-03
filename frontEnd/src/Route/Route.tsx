import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import LandingPage from "../Components/LandingPage.tsx";
import Inscription from "../Components/Authentification/Inscription.tsx";
import Connexion from "../Components/Authentification/Connexion.tsx";
import ProfileRoute from "./RouteProtected/ProfileRoute.tsx";
import LandingPage2 from "../Components/LandingPage2/LandingPage2.tsx";
import ProgramsPage from "../Components/Program/ProgramsPage.tsx";
import DashBoardRoute from "./RouteProtected/DashBoardRoute.tsx";
import ProgramsDashBoardRoute from "./RouteProtected/ProgramsDashBoardRoute.tsx";
import CommunityPage from "../Components/Communaute/CommutyPages.tsx";
import AuthentificationRoute from "./RouteProtected/AuthentificationRoute.tsx";
import AdminRoute from "./RouteProtected/AdminRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "profile",
        element: <ProfileRoute />,
      },
      {
        path: "landingPage",
        element: <LandingPage2 />,
      },
      {
        path: "createPrograms",
        element: <ProgramsDashBoardRoute />,
      },
      {
        path: "programs",
        element: <ProgramsPage />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
      {
        path: "dashboard",
        element: <DashBoardRoute />,
      },
      {
        element: <AuthentificationRoute />,
        children: [
          {
            path: "inscription",
            element: <Inscription />,
          },
          {
            path: "connexion",
            element: <Connexion />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminRoute />,
      },
    ],
    errorElement: <p>Erreur 404</p>,
  },
]);
