import React from "react";
import classnames from "classnames";

interface IProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ref: React.Ref<any>;
}

const Button = (props: IProps) => {
  const { className, children, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={classnames(
        className,
        "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
      )}
    >
      {children}
    </button>
  );
};

export default React.forwardRef((props: IProps, ref) => (
  <Button ref={ref} {...props} />
));
