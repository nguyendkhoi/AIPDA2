import Assosiation from "./Assosiation";
import Editions from "./Editions";
import Hero from "./Hero";
import Hero2 from "./Hero2";
import Invitation from "./Invitation";
import Media from "./Media";
import Programme from "./Programmes";
import Rapports from "./Rapports";

export default function LandingPage2() {
  return (
    <>
      <Hero />
      <Programme />
      <Invitation />
      <Assosiation />
      <div className="relative z-20">
        <Hero2 />
      </div>
      <div className="bg-[rgb(242,244,255)] rounded relative -mt-20 px-[2rem] pt-20 md:-mt-32 md:pt-32 lg:-mt-48 lg:pt-70 z-10 pb-40">
        <Editions />
        <Media />
        <Rapports />
      </div>
    </>
  );
}
