import Button from "../Button";
import { useRedirection } from "../Hooks/useRedirection";

export default function Hero() {
  const { redirectTo } = useRedirection();

  return (
    <section id="hero" className="pt-20">
      <div className="bg-yellow-300 h-80 rounded-lg py-9 text-center">
        <h1 className="text-4xl font-bold">
          Développez vos <br />
          compétences en design
        </h1>
        <p className="py-4">
          Rejoignez une communauté dynamique de disigners et participez <br />à
          des sessions interactives pour enrichir vos connaissances
        </p>
        <div className="buttons pt-1">
          <Button
            bgColor="black"
            classes="mr-2"
            onClick={() => redirectTo("/inscription?role=participant")}
          >
            Participer aux sessions
          </Button>
          <Button
            classes="border-1 border-black"
            onClick={() => redirectTo("/inscription?role=animateur")}
          >
            Devenir animateur
          </Button>
        </div>
      </div>
    </section>
  );
}
