import React from "react";

interface CardProps {
  img: string;
  title: string;
  children: React.ReactNode;
  classes?: string;
}

const Card: React.FC<CardProps> = ({ img, title, children, classes }) => {
  return (
    <div className={`bg-[rgb(242,244,255)] p-4 rounded ${classes}`}>
      <img src={img} className="bg-black p-2 rounded-lg" />
      <p className="font-bold my-2">{title}</p>
      <p className="text-sm">{children}</p>
    </div>
  );
};

export default Card;
