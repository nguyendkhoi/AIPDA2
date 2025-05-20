import React from "react";
import { User as UserIcon } from "lucide-react";

interface AboutSectionProps {
  bio: string;
  expertises: string[] | undefined;
}

const AboutSection: React.FC<AboutSectionProps> = ({ bio, expertises }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <UserIcon className="w-5 h-5 mr-2 text-indigo-600" />À propos
    </h2>
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-gray-600 mb-4">
        {bio || "Aucune biographie renseignée"}
      </p>
      {expertises && expertises.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {/* Boucle pour afficher chaque expertise comme un tag */}
          {expertises.map((expertise, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
            >
              {expertise}
            </span>
          ))}
        </div>
      )}
    </div>
  </section>
);
export default AboutSection;
