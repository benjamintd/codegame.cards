import React from "react";
import classnames from "classnames";

interface IProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  color?: "blue" | "red" | "dark-red" | "dark-blue" | "neutral";
  onClick?: () => void;
}

const Button = (props: IProps) => {
  const { className, children, onClick, color } = props;
  return (
    <button
      {...props}
      onClick={onClick}
      className={classnames(
        className,
        "text-white font-bold py-2 px-4 border-b-4 rounded",
        {
          "bg-blue-700 hover:bg-blue-600 hover:border-blue-700 border-blue-800":
            !color || color === "blue",
          "bg-blue-800 hover:bg-blue-700 hover:border-blue-800 border-blue-900":
            color === "dark-blue",
          "bg-red-700 hover:bg-red-600 hover:border-red-700 border-red-800":
            color === "red",
          "bg-red-800 hover:bg-red-700 hover:border-red-800 border-red-900":
            color === "dark-red",
          "text-gray-800 bg-gray-400 hover:bg-gray-300 hover:border-gray-400 border-gray-500":
            color === "neutral",
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
