import { FC, ReactNode } from "react";

type Props = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
  className?: string;
};

const Button: FC<Props> = ({ children, onClick, className }) => {
  return (
    <button
      className={
        "bg-blue-500 text-white font-bold py-2 px-4 rounded m-1" +
        " " +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
