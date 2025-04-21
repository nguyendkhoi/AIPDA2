import Card from "./Card";
import webinaire from "../../assets/icons/webinaire.svg";
import atelier from "../../assets/icons/atelier.svg";
import talks from "../../assets/icons/talks.svg";

export default function Programme() {
  return (
    <section id="programmes" className="pt-5">
      <h2 className="pb-10 font-bold text-2xl text-center">Nos programmes</h2>
      <div className="flex flex-col items-center space-y-4 lg:flex-row lg:justify-between lg:space-x-4 lg:space-y-0">
        <Card
          title="Webinaires"
          classes="w-3/4 lg:basis-1/3 lg:h-40"
          img={webinaire}
        >
          Des sessions en ligne interactives pour approfondir vos connaissances
        </Card>
        <Card
          title="Ateliers"
          classes="w-3/4 lg:basis-1/3 lg:h-40"
          img={atelier}
        >
          Des travaux pratiques pour développer vos compétences
        </Card>
        <Card title="Talks" classes="w-3/4 lg:basis-1/3 lg:h-40" img={talks}>
          Des présentations courtes pour découvrir de nouveaux sujets
        </Card>
      </div>
    </section>
  );
}
