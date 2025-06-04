import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../Context/AuthContext.tsx";
import "./Inscription.css";
import { useRedirection } from "../../Hooks/useRedirection.tsx";
import Input from "./Input.tsx";
import Button from "../Button.tsx";
import { AuthLoginData as FormData } from "../../types/auth.ts";

export default function Connexion() {
  const { handleLogin, signupError } = useAuth();
  const { redirectTo } = useRedirection();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log("Form data", formData);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleLogin(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="px-4 max-w-7xl mx-auto w-1/2 justify-self-center">
        <h2 className="text-5xl mb-6 ">Se connecter</h2>
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit">Se Connecter</Button>
        </form>
        {signupError && <p className="text-red-500">{signupError}</p>}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous avez pas de compte ?{" "}
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
              onClick={() => redirectTo("/inscription")}
            >
              Inscrivez-vous
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
