import { ArrowRight, Star, Users } from "lucide-react";
import { useRedirection } from "../../Hooks/useRedirection.tsx";
import { useEffect, useState } from "react";
import { getUserCommunity } from "../../api/user.ts";
import { UserCommunity } from "../../types/user.ts";

const CommunityPage = () => {
  const { redirectTo } = useRedirection();

  //Pour le moment, c'est fictif, on verra pour plus tard
  const stats = [
    { label: "Membres actifs", value: "500+" },
    { label: "Sessions réalisées", value: "150+" },
    { label: "Animateurs experts", value: "25+" },
  ];

  const [allUsers, settAllUsers] = useState<UserCommunity[] | null>(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const userData: UserCommunity[] = await getUserCommunity();
        settAllUsers(userData);
      } catch (err) {
        console.error("Fetch user pour communaute: ", err);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <>
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Une communauté passionnée de{" "}
              <span className="text-indigo-600">designers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez un réseau dynamique de professionnels du design et
              participez à des échanges enrichissants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/*
                            Avant → onParticipationSelect('Animateur') |  onParticipationSelect('Participant')
                            Apres ⇒ faire une redirection sur la page programmes
                            */}
              <button
                onClick={() => {
                  redirectTo("/inscription");
                }}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
              >
                Devenir participant
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  redirectTo("/inscription");
                }}
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition"
              >
                Devenir animateur
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <p className="text-3xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Featured Members */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Membres de la communauté
              </h2>
              <button
                onClick={() => {}}
                className="text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                <Users className="w-5 h-5 mr-2" />
                Rejoindre
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {allUsers?.map((member) => (
                <div
                  key={member.full_name}
                  className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center"
                >
                  <img
                    src={`${member.photo}?w=150&h=150&fit=crop`}
                    alt={member.full_name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.full_name}
                  </h3>
                  <p className="text-indigo-600 mb-2">{member.profession}</p>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {member.role}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertises.map((skill) => (
                      <span
                        key={skill}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-indigo-600 rounded-xl shadow-lg p-8 text-center text-white mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à rejoindre la communauté ?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Que vous soyez participant ou animateur, votre expertise enrichira
              notre communauté. Rejoignez-nous dès aujourd'hui !
            </p>
            <button
              onClick={() => {}}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition font-semibold"
            >
              S'inscrire maintenant
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityPage;
