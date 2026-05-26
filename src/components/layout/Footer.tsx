import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto bg-bg-sub-dark pt-8 pb-6 border-t border-dashed border-border-grid/30 font-terminal">
      <div className="px-6 grid grid-cols-1 md:grid-cols-3 text-[11px] text-white/70 uppercase tracking-wider text-left">
        <div className="p-4 flex flex-col gap-2 md:justify-self-center items-start w-full max-w-[200px]">
          <span className="text-[9px] text-white/40 font-bold tracking-widest block mb-1">
            // CORE_STACK
          </span>
          <span>React Architecture</span>
          <span>Tailwind CSS v4</span>
          <span>RESTful Backend API</span>
        </div>
        <div className="p-4 flex flex-col gap-1 md:justify-self-center md:pl-12 items-start w-full max-w-[280px]">
          <span className="text-[9px] text-white/40 font-bold tracking-widest">
            // AUTHOR_SIGNATURE
          </span>
          <div className="text-xs font-bold text-white/50 tracking-normal pt-0.5">
            Thabata Denise Monteiro da Silva
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3 md:justify-self-center md:pl-12 items-start w-full max-w-[220px]">
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
