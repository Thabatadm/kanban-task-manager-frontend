import React, { useState } from "react";
import { Button } from "../ui/Button";
import { X, Shield, Edit3, Calendar, FileText, Users } from "lucide-react";
import type { ExtendedProject, ProjectUserBackend } from "../../types/project";
import CreateProjectModal from "./CreateProject";
import { useAuth } from "../../hooks/useAuth";

interface ProjectDetailModalProps {
  project: ExtendedProject;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onProjectUpdated,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const projectMembers: ProjectUserBackend[] =
    project.projectUsers || project.members || [];

  console.log("=== COMPROBACIÓN DE SESIÓN ===");
  console.log("Email guardado en AuthContext (Tú):", user?.email);
  console.log("Objeto 'user' completo de la sesión:", user);
  console.log(
    "Emails de los miembros en el Proyecto:",
    projectMembers.map((m) => m.user?.email),
  );
  const currentUserEmail = user?.email || "";
  const currentMember = projectMembers.find(
    (member) =>
      member.user?.email?.toLowerCase() === currentUserEmail.toLowerCase(),
  );
  const isMaster = currentMember?.role === "MASTER";

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 box-border">
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-3xl bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/60 rounded-3xl p-4 sm:p-8 shadow-2xl z-10 max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden font-main box-border min-w-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 text-grey-custom hover:text-black dark:hover:text-white hover:bg-bg-sub-light dark:hover:bg-bg-sub-dark rounded-xl transition-colors z-20"
          >
            <X size={18} />
          </button>

          <div className="mb-4 sm:mb-6 border-b border-dashed border-border-grid-light dark:border-border-grid pb-4 sm:pb-5 flex-shrink-0 pr-8">
            <div className="flex items-center gap-2 text-[10px] sm:text-terminal-sm font-terminal text-brand-accent uppercase tracking-widest mb-1 truncate">
              <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping flex-shrink-0" />
              Ecosystem Diagnostics Mainframe
            </div>
            <h2 className="text-xl sm:text-title-main font-title text-black dark:text-white uppercase tracking-tighter break-words">
              {project.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-grey-custom dark:text-grey-custom-dark font-body mt-2">
              <Calendar size={14} className="flex-shrink-0" />
              <span className="truncate">
                Initialized:{" "}
                {project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 sm:gap-6 overflow-y-auto pr-1 flex-1 min-h-0 w-full box-border">
            <div className="md:col-span-3 space-y-4 flex flex-col justify-between min-w-0 w-full">
              <div className="p-4 sm:p-5 bg-bg-sub-light dark:bg-bg-sub-dark rounded-2xl border border-border-grid-light dark:border-border-grid/40 flex-1 min-w-0">
                <h4 className="text-xs font-title text-grey-custom dark:text-grey-custom-dark uppercase tracking-wider flex items-center gap-2 mb-3">
                  <FileText size={14} className="flex-shrink-0" /> Core Logs
                  Description
                </h4>
                <p className="text-xs sm:text-subtitle font-body text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                  {project.description ||
                    "No description logs detailed inside this workspace node."}
                </p>
              </div>

              {isMaster && (
                <div className="hidden md:block pt-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-widest py-3 border border-border-grid dark:border-slate-700/60 font-title"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit3 size={14} />
                    Modify Workspace Config
                  </Button>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex flex-col h-full min-h-[240px] md:min-h-[300px] min-w-0 w-full">
              <div className="flex items-center justify-between mb-2.5 flex-shrink-0">
                <h3 className="text-xs font-title text-grey-custom dark:text-grey-custom-dark uppercase tracking-widest flex items-center gap-1.5">
                  <Users size={14} className="flex-shrink-0" /> Sector Members (
                  {projectMembers.length})
                </h3>
              </div>

              <div className="flex-1 bg-bg-sub-light/40 dark:bg-bg-sub-dark/40 rounded-2xl border border-border-grid-light dark:border-border-grid/50 p-3 sm:p-4 space-y-3 overflow-y-auto box-border min-w-0 w-full">
                {projectMembers.length === 0 ? (
                  <p className="text-xs text-grey-custom dark:text-grey-custom-dark italic text-center py-12 md:py-16">
                    No terminal agents deployed to this sector.
                  </p>
                ) : (
                  projectMembers.map((member) => {
                    const innerUser = member.user;
                    const memberName = innerUser
                      ? `${innerUser.name} ${innerUser.lastName}`.trim()
                      : `Agent #${member.id}`;
                    const memberEmail = innerUser?.email || "No email log";

                    return (
                      <div
                        key={member.id}
                        className="p-3 bg-bg-main-light dark:bg-bg-main-dark border border-border-grid-light dark:border-border-grid/60 rounded-xl transition-all hover:border-brand-accent/60 min-w-0 box-border"
                      >
                        <div className="truncate w-full">
                          <p className="text-xs font-title text-black dark:text-white truncate">
                            {memberName}
                          </p>
                          <p className="text-[11px] sm:text-terminal-sm font-terminal text-grey-custom dark:text-grey-custom-dark truncate">
                            {memberEmail}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-terminal text-brand-accent uppercase tracking-tighter bg-bg-sub-dark border border-brand-accent/20 px-1.5 py-0.5 rounded-md">
                            <Shield size={8} />
                            {member.role || "DEVELOPER"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {isMaster && (
              <div className="block md:hidden pt-2 flex-shrink-0 w-full mt-2">
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-widest py-3 border border-border-grid dark:border-slate-700/60 font-title"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit3 size={14} />
                  Modify Workspace Config
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && isMaster && (
        <CreateProjectModal
          isOpen={isEditModalOpen}
          projectToEdit={project}
          onClose={() => setIsEditModalOpen(false)}
          onProjectCreated={() => {
            setIsEditModalOpen(false);
            onProjectUpdated();
          }}
        />
      )}
    </>
  );
};

export default ProjectDetailModal;
