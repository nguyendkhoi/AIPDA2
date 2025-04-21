import { ArrowRight, Award, Calendar, Star, Users } from "lucide-react";

//la condition pour cette page, c'est qu'elle apparait aussi lorsque le ! ParticipationType
//'la page est la si et seulement si la page la currentPage = landing et que  !participationType '

const LandingPage = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Développez vos compétences en{" "}
            <span className="text-indigo-600">design</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Rejoignez une communauté dynamique de designers et participez à des
            sessions interactives pour enrichir votre expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/*Au niveau du button, il faut rediriger vers la page programmes */}
            <button
              onClick={() => {}}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
            >
              Participer aux sessions
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => {}}
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition"
            >
              Devenir animateur
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="programmes" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos programmes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Webinaires</h3>
              <p className="text-gray-600">
                Des sessions en ligne interactives pour approfondir vos
                connaissances.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ateliers</h3>
              <p className="text-gray-600">
                Des sessions pratiques pour développer vos compétences
                techniques.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Talks</h3>
              <p className="text-gray-600">
                Des discussions enrichissantes avec des experts du domaine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="communaute" className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Rejoignez notre communauté
          </h2>
          <div className="flex items-center justify-center mb-8">
            <Users className="w-16 h-16 text-indigo-600" />
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Faites partie d'un réseau de professionnels passionnés et partagez
            vos expériences.
          </p>
          <button
            onClick={() => {}}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition"
          >
            S'inscrire maintenant
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
