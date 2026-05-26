import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => (
  <div className="w-full space-y-2">
    {label && (
      <label className="block text-terminal-sm font-weight-terminal text-slate-500 dark:text-slate-300 uppercase tracking-tighter ml-1">
        {label}
      </label>
    )}
    <input
      {...props}
      className={`w-full px-5 py-4 bg-bg-main-light dark:bg-bg-sub-dark border border-border-grid rounded-xl text-black dark:text-white focus:ring-2 focus:ring-brand-accent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${className}`}
    />
  </div>
);
