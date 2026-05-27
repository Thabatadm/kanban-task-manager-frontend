import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto bg-bg-sub-dark pt-8 pb-6 border-t border-dashed border-border-grid/30 font-terminal">
      <div className="px-6 grid grid-cols-3 gap-x-6 md:gap-x-12 divide-x divide-border-grid/30 text-[11px] text-white/70 uppercase tracking-wider text-center items-center py-2">
        <div className="p-2 md:p-4 flex flex-col gap-2 text-center w-full">
          <span className="text-[9px] text-white/40 font-bold tracking-widest block mb-1">
            // CORE_STACK
          </span>
          <span className="truncate w-full">React Architecture</span>
          <span className="truncate w-full">Tailwind CSS v4</span>
          <span className="truncate w-full">RESTful API</span>
        </div>
        <div className="p-2 md:p-4 pl-6 md:pl-12 flex flex-col gap-1 text-center w-full">
          <span className="text-[9px] text-white/40 font-bold tracking-widest">
            // AUTHOR_SIGNATURE
          </span>
          <div className="text-xs font-bold text-white/50 tracking-normal pt-0.5 break-words w-full">
            Thabata Denise Monteiro da Silva
          </div>
        </div>
        <div className="p-2 md:p-4 pl-6 md:pl-12 flex flex-col gap-3 text-center w-full">
          <span className="text-[9px] text-white/40 font-bold tracking-widest mb-1">
            // CONTACT_ME
          </span>
          <a
            href="mailto:mthabatadenise@gmail.com"
            className="text-[10px] tracking-widest font-bold text-brand-accent hover:text-white transition-colors duration-200"
            title="Send email"
          >
            EMAIL
          </a>
          <a
            href="https://www.linkedin.com/in/thabata-denise-monteiro-ba972a397/"
            className="text-[10px] tracking-widest font-bold text-brand-accent hover:text-white transition-colors duration-200"
            title="My Linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            LINKEDIN
          </a>

          <span className="text-[10px] text-white/40 tracking-widest pt-3 border-t border-slate-800/40 w-full mt-1">
            SYS_VER_1.0 // © {currentYear}
          </span>
        </div>
      </div>
    </footer>
  );
};
