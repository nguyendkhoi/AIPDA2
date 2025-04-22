import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./Components/Context/AuthContext";
import NavBar from "./Components/NavBar";
import { ProgramModal } from "./Components/Program/ProgramModal";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <ProgramModal />
    </AuthProvider>
  );
}

export default App;
