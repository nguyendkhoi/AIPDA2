import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext.tsx";
import "./Inscription.css";
import { useRedirection } from "../../Hooks/useRedirection.tsx";
import type { AuthSignupData as FormData } from "../../types/auth.ts";
import Input from "./Input.tsx";
import Button from "../Button.tsx";

type Role = "participant" | "animateur" | "";

function getInitialRoleFromURL(): Role {
  const params = new URLSearchParams(window.location.search);
  const roleFromURL = params.get("role");

  if (roleFromURL === "participant" || roleFromURL === "animateur") {
    return roleFromURL;
  }

  return "";
}

export default function Inscription() {
  const { handleSignup, signupError, user } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role>("");
  // photoFile is now integrated into formData
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    name: "",
    role: "",
    email: "",
    telephone: "",
    password: "",
    password2: "",
    photo: null, // Initialize photo to null
    pays_residence: "",
    profession: "",
    organisation: "",
    lien_portfolio: "",
    expertises: ["", ""],
  });

  const { redirectTo } = useRedirection();

  const handleAddExpertise = () => {
    setFormData({
      ...formData,
      expertises: [...(formData.expertises ?? []), ""],
    });
  };

  const handleRemoveExpertise = (indexToRemove: number) => {
    const newExpertises = (formData.expertises ?? []).filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, expertises: newExpertises });
  };

  useEffect(() => {
    const initialRole = getInitialRoleFromURL();
    setSelectedRole(initialRole);
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: initialRole,
    }));
  }, []);

  function handleRoleChange(e: ChangeEvent<HTMLInputElement>) {
    const newRole = e.target.value as Role;
    setSelectedRole(newRole);
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: newRole,
    }));
    console.log("Form data", formData);
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name.startsWith("expertise_")) {
      const index = parseInt(name.split("_")[1]);
      const newExpertises = [...(formData.expertises ?? [])];
      newExpertises[index] = value;
      setFormData({ ...formData, expertises: newExpertises });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    console.log("Form data", formData);
  }

  // Modified to update formData.photo
  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        photo: e.target.files![0], // Use non-null assertion as we've checked for existence
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        photo: null,
      }));
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSignup(formData);
  };

  return (
    <div className="pt-32 px-4">
      <div className="max-w-4xl mx-auto">
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
              placeholder="Prénom"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Nom"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="my-4">
            <Input
              placeholder="Photo de profil (facultatif)"
              type="file"
              id="photo-upload"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {formData.photo && ( // Check formData.photo directly
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Aperçu"
                className="mt-2 h-20 w-20 object-cover rounded"
              />
            )}
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
          {selectedRole === "animateur" && (
            <>
              <Input
                placeholder="Pays de résidence"
                name="pays_residence"
                value={formData.pays_residence}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Profession / Fonction actuelle"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
              />
              <div className="my-4">
                <label className="block text-xl mb-2">Expertises :</label>
                {(formData.expertises ?? []).map((expertise, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder={`Expertise ${index + 1}`}
                      name={`expertise_${index}`}
                      value={expertise}
                      onChange={handleChange}
                    />
                    {(formData.expertises ?? []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExpertise(index)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddExpertise}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Ajouter une expertise
                </button>
              </div>
              <Input
                placeholder="Organisation / Entreprise / Institution (si applicable)"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
              />
              <Input
                type="url"
                placeholder="Lien vers votre portfolio, site web ou LinkedIn"
                name="lien_portfolio"
                value={formData.lien_portfolio}
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
                className="text-yellow-500 hover:text-yellow-600 font-medium"
                onClick={() => redirectTo("/connexion")}
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
