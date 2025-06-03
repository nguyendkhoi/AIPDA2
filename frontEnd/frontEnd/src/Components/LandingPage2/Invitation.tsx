import communate from "../../assets/icons/communate.svg";
import Button from "../Button";
import { useRedirection } from "../../Hooks/useRedirection";

export default function Invitation() {
  const { redirectTo } = useRedirection();

  return (
    <section
      id="invitation"
      className="bg-[rgb(239,242,255)] flex flex-col items-center mt-10 rounded"
    >
      <h2 className="font-bold text-2xl text-center rounded mt-11">
        Rejoignez notre communauté
      </h2>
      <img src={communate} className="mt-6" />
      <p className="text-center my-6">
        Faites partie d'un réseau professionnels pasionnés <br />
        et partagez vos expériences.
      </p>
      <Button
        bgColor="black"
        classes="mt-7 mb-9 py-3"
        onClick={() => redirectTo("/inscription?role=participant")}
      >
        S'inscrire maintenant
      </Button>
    </section>
  );
}
