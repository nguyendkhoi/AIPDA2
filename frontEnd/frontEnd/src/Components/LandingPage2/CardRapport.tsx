import React from "react";

interface CardRapportProps {
  img: string;
  title: string;
  children: React.ReactNode;
  classes?: string;
  semaine: number | string;
}

const CardRapport: React.FC<CardRapportProps> = ({
  img,
  title,
  children,
  classes,
  semaine,
}) => {
  return (
    <div className={`p-4 rounded ${classes} bg-white rounded-[1em] text-left`}>
      <p className="text-[11px]">SEMAINE {semaine}</p>
      <h4 className="text-lg">{title}</h4>
      <p className="my-5">{children}</p>
      <img src={img} className="rounded-[20px] my-2"></img>
    </div>
  );
};

export default CardRapport;
