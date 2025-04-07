import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../contextApi/AuthContext";
import "./Inscription.css";

import Input from "./Input.tsx";
import Button from "../Button.tsx";

interface FormData {
  prenom: string;
  nom: string;
  role: string;
  email: string;
  telephone: string;
  password: string;
  password2: string;
  pay: string;
  profession: string;
  organisation: string;
  portfolio: string;
}

type Role = "participant" | "animateur" | "";

export default function Inscription() {
  const { handleSignup, signupError } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>("");
  const [formData, setFormData] = useState<FormData>({
    prenom: "",
    nom: "",
    role: "",
    email: "",
    telephone: "",
    password: "",
    password2: "",
    pay: "",
    profession: "",
    organisation: "",
    portfolio: "",
  });

  function handleRoleChange(e: ChangeEvent<HTMLInputElement>) {
    const newRole = e.target.value as Role;
    setSelectedRole(newRole);
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: newRole,
    }));
    console.log("Form data", formData);
  }

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

    handleSignup(formData);
  };

  return (
    <div className="pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl mb-6 ">
          Inscription{" "}
          {selectedRole ? (
            <>
              comme <span className="font-bold">{selectedRole}</span>
            </>
          ) : (
            ""
          )}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              placeholder="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="my-4">
            <p className="mb-2 text-xl">Vous voulez devenir:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="participant"
                  checked={selectedRole === "participant"}
                  onChange={handleRoleChange}
                  className="cursor-pointer"
                  required
                />
                Participant
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="animateur"
                  checked={selectedRole === "animateur"}
                  onChange={handleRoleChange}
                  className="cursor-pointer"
                  required
                />
                Animateur
              </label>
            </div>
          </div>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          <Input
            type="tel"
            placeholder="Numéro de téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            autoComplete="tel"
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          {selectedRole === "animateur" && (
            <>
              <Input
                type="text"
                placeholder="Pays de résidence"
                name="pay"
                value={formData.pay}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                placeholder="Profession / Fonction actuelle"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                placeholder="Organisation / Entreprise / Institution (si applicable)"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
              />
              <Input
                type="url"
                placeholder="Lien vers votre portfolio, site web ou LinkedIn"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                required
              />
            </>
          )}
          {signupError && <p className="text-red-500">{signupError}</p>}
          <Button type="submit">S'inscrire</Button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
