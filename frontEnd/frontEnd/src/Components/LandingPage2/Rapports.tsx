import imgBlack from "../../assets/surface-of-dark-black-metal.webp";
import CardRapport from "./CardRapport";

export default function Rapports() {
  return (
    <section id="rapports" className="text-center ">
      <h2 className="text-3xl font-bold text-gray-800 mb-5 mt-20">
        Consultez nos rapports
      </h2>
      <p>
        Retrouvez en accès libre l’intégralité des comptes rendu des <br />
        différentes semaines de nos campagnes #AIPDATOUR.
      </p>
      <div className="flex flex-col items-center space-y-4 mt-12 px-10 lg:flex-row lg:justify-between lg:space-x-10 lg:space-y-0 ">
        <CardRapport semaine="1" title="Webinaire" img={imgBlack}>
          Positionner le design comme un atout stratégique qui apporte des
          avantages tangibles à un produit, un service, une entreprise, un
          marché, un secteur, une économie, une nation
        </CardRapport>
        <CardRapport semaine="2" title="Atelier" img={imgBlack}>
          Positionner le design comme un atout stratégique qui apporte des
          avantages tangibles à un produit, un service, une entreprise, un
          marché, un secteur, une économie, une nation.
        </CardRapport>
        <CardRapport semaine="3" title="Talk" img={imgBlack}>
          Positionner le design comme un atout stratégique qui apporte des
          avantages tangibles à un produit, un service, une entreprise, un
          marché, un secteur, une économie, une nation
        </CardRapport>
      </div>
    </section>
  );
}
