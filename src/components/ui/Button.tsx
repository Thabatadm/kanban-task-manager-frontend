import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  isLoading,
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-bold rounded-xl select-none [-webkit-tap-highlight-color:transparent]";

  const variants = {
    primary:
      "bg-amber-400 hover:bg-amber-500 text-black shadow-lg shadow-amber-400/10 px-4 py-2.5 sm:py-3.5 sm:px-6",
    secondary: 
      "bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 sm:py-3.5 sm:px-6",
    danger:
      "bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 px-4 py-2.5 sm:py-3.5 sm:px-6",
    ghost:
      "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white p-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};