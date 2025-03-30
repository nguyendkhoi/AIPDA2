import AppHome from "./components/AppHome.tsx";
import { AuthProvider } from "./components/contextApi/AuthContext.tsx";

const App = () => {
  return (
    <AuthProvider>
      <AppHome />
    </AuthProvider>
  );
};

export default App;
