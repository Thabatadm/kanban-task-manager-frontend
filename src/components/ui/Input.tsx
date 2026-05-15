import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = ({label, className, ...props}: InputProps) => (
    <div className="w-full space-y-2">
        {label && (
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-tighter ml-1">
                {label}
            </label>
        )}
        <input
        {...props}
        className={`w-full px-5 py-4 bg-slate-100 dark:bg-slate-900 border border-slate-800 rounded-xl text-black dark:text-white focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-200 ${className}`}
        />
    </div>

);