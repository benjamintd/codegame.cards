import React from "react";
import classnames from "classnames";

interface IProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  color?: "blue" | "red" | "dark-red" | "dark-blue";
  onClick?: () => void;
  ref: React.Ref<any>;
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
          "bg-blue-500 hover:bg-blue-400 hover:border-blue-500 border-blue-700":
            !color || color === "blue",
          "bg-blue-700 hover:bg-blue-600 hover:border-blue-700 border-blue-900":
            color === "dark-blue",
          "bg-red-500 hover:bg-red-400 hover:border-red-500 border-red-700":
            color === "red",
          "bg-red-700 hover:bg-red-600 hover:border-red-700 border-red-900":
            color === "dark-red",
        }
      )}
    >
      {children}
    </button>
  );
};

export default React.forwardRef((props: IProps, ref) => (
  <Button ref={ref} {...props} />
));
