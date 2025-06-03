import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  bgColor?: "black";
  classes?: string;
}

export default function Button({
  children,
  bgColor,
  classes = "",
  ...props
}: ButtonProps) {
  const baseStyle =
    "text-sm py-2 px-4 rounded transition-all duration-500 ease-in-out";

  const blackStyle =
    "bg-black text-yellow-300 hover:bg-yellow-300 hover:text-black";

  const yellowStyle =
    "bg-yellow-300 text-black font-medium hover:bg-black hover:text-yellow-300";

  const finalClassName = `
    ${baseStyle}
    ${bgColor === "black" ? blackStyle : yellowStyle}
    ${classes}
  `;

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
}
