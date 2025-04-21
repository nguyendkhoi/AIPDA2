import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import LandingPage from "../Components/LandingPage.tsx";
import Inscription from "../Components/Authentification/Inscription.tsx";
import Connexion from "../Components/Authentification/Connexion.tsx";
import ProfileRoute from "../Components/RouteProtected/ProfileRoute.tsx";
import LandingPage2 from "../Components/LandingPage2/LandingPage2.tsx";
import ProgramsDashBoardRoute from "../Components/RouteProtected/ProgramsDashBoardRoute.tsx";

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
        path: "inscription",
        element: <Inscription />,
      },
      {
        path: "connexion",
        element: <Connexion />,
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
    ],
    errorElement: <p>Erreur 404</p>,
  },
]);
