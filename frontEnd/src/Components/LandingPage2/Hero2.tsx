import Button from "../Button";
import { useRedirection } from "../../Hooks/useRedirection";

export default function Hero2() {
  const { redirectTo } = useRedirection();

  return (
    <section
      id="hero2"
      className="flex bg-yellow-300 h-110 rounded-lg p-9 mt-20 space-x-1 relative"
    >
      <div className="basis-3/4">
        <h2 className="text-xl font-bold lg:text-2xl">
          Devenez acteur du changement
          <br />
          grâce à nos campagnes #AIPDATOUR
        </h2>
        <p className="mt-4 lg:text-base text-sm">
          Les campagnes #AIPDATOUR sont des activations 100% digitales portées
          par notre département sensibilisation. Elles se déroulent pendant
          trois semaines sur les périodes respectives de février, avril, juin et
          août de l'année en cours. Chaque campagne #AIPDATOUR a pour objectif
          de diffuser le design grâce au web, sensibiliser au role du design en
          Afrique, mettre en avant les talents locaux et promouvoir les valeurs
          de l'Alliance Internationale pour la Promotion du Design en Afrique
          (AIPDA)
        </p>
        <div className="buttons pt-1 my-10">
          <Button
            bgColor="black"
            classes="mr-2"
            onClick={() => redirectTo("/inscription?role=participant")}
          >
            Participer aux sessions
          </Button>
          <Button onClick={() => redirectTo("/inscription?role=animateur")}>
            Devenir animateur
          </Button>
        </div>
      </div>
      <p className="bg-red-300 w-1/2">Image</p>
    </section>
  );
}
