import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => (
  <div className="w-full space-y-1.5 text-left box-border">
    {label && (
      <label className="block text-xs font-terminal text-slate-500 dark:text-slate-300 uppercase tracking-tighter ml-1 select-none">
        {label}
      </label>
    )}
    <input
      {...props}
      className={`w-full px-4 py-2.5 sm:py-3.5 bg-bg-main-light dark:bg-bg-sub-dark border border-border-grid rounded-xl text-sm text-black dark:text-white focus:ring-2 focus:ring-brand-accent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 box-border ${className}`}
    />
  </div>
);