import React, { useState } from "react";
import { Button } from "../ui/Button";
import { X, Shield, Edit3, Calendar, FileText, Users } from "lucide-react";
import type { ExtendedProject, ProjectUserBackend } from "../../types/project";
import CreateProjectModal from "./CreateProject";

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

  const projectMembers: ProjectUserBackend[] =
    project.projectUsers || project.members || [];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-3xl bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/60 rounded-3xl p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden font-main">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 text-grey-custom hover:text-black dark:hover:text-white rounded-xl transition-colors"
          >
            <X size={18} />
          </button>

          <div className="mb-6 border-b border-dashed border-border-grid-light dark:border-border-grid pb-5 flex-shrink-0">
            <div className="flex items-center gap-2 text-terminal-sm font-terminal text-brand-accent uppercase tracking-widest mb-1">
              <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping" />
              Ecosystem Diagnostics Mainframe
            </div>
            <h2 className="text-title-main font-title text-black dark:text-white uppercase tracking-tighter">
              {project.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-grey-custom dark:text-grey-custom-dark font-body mt-2">
              <Calendar size={14} />
              <span>
                Initialized:{" "}
                {project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-y-auto pr-1 flex-1 min-h-0">
            <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
              <div className="p-5 bg-bg-sub-light dark:bg-bg-sub-dark rounded-2xl border border-border-grid-light dark:border-border-grid/40 flex-1">
                <h4 className="text-xs font-title text-grey-custom dark:text-grey-custom-dark uppercase tracking-wider flex items-center gap-2 mb-3">
                  <FileText size={14} /> Core Logs Description
                </h4>
                <p className="text-subtitle font-body text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {project.description ||
                    "No description logs detailed inside this workspace node."}
                </p>
              </div>

              <div className="pt-4 flex-shrink-0">
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 text-terminal-sm uppercase tracking-widest py-3 border border-border-grid dark:border-slate-700/60 font-title"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit3 size={14} />
                  Modify Workspace Config
                </Button>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col h-full min-h-[300px]">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h3 className="text-xs font-title text-grey-custom dark:text-grey-custom-dark uppercase tracking-widest flex items-center gap-1.5">
                  <Users size={14} /> Sector Members ({projectMembers.length})
                </h3>
              </div>

              <div className="flex-1 bg-bg-sub-light/40 dark:bg-bg-sub-dark/40 rounded-2xl border border-border-grid-light dark:border-border-grid/50 p-4 space-y-3 overflow-y-auto">
                {projectMembers.length === 0 ? (
                  <p className="text-xs text-grey-custom dark:text-grey-custom-dark italic text-center py-16">
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
                        className="p-3 bg-bg-main-light dark:bg-bg-main-dark border border-border-grid-light dark:border-border-grid/60 rounded-xl transition-all hover:border-brand-accent/60"
                      >
                        <div className="truncate">
                          <p className="text-xs font-title text-black dark:text-white truncate">
                            {memberName}
                          </p>
                          <p className="text-terminal-sm font-terminal text-grey-custom dark:text-grey-custom-dark truncate">
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
          </div>
        </div>
      </div>

      {isEditModalOpen && (
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
