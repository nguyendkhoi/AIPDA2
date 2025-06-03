import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import NavBar from "./Components/NavBar";
import AlertMessage from "./Components/AlertMessage";

const MainLayout = () => {
  const { setAlertInfo, alertInfo } = useAuth();
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      {alertInfo && (
        <AlertMessage
          message={alertInfo.message}
          type={alertInfo.type}
          onDismiss={() => setAlertInfo(null)}
        />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
