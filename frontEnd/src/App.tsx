import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./Components/Context/AuthContext";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </AuthProvider>
  );
}

export default App;
