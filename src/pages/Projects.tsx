import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import CreateProjectModal from "../components/projects/CreateProject";
import ProjectDetailsModal from "../components/projects/ProjectDetailModal";
import {
  FolderKanban,
  Plus,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { projectService } from "../services/projectService";
import type { ExtendedProject } from "../types/project";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] =
    useState<ExtendedProject | null>(null);
  const navigate = useNavigate();

  const fetchProjects = async (isMounted: boolean) => {
    try {
      if (isMounted) {
        setError("");
      }

      const data = await projectService.getProjects();

      if (isMounted) {
        setProjects(data);
      }
    } catch (err) {
      console.error("Error loading system projects:", err);
      if (isMounted) {
        setError("FAILED TO FETCH CORE ROUTINE PROJECTS FROM TERMINAL.");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      await fetchProjects(isMounted);
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-title-main font-title text-black dark:text-white uppercase tracking-tighter">
            System <span className="text-brand-accent">Projects</span>
          </h1>

          <p className="text-grey-custom dark:text-grey-custom-dark text-subtitle font-body italic mt-1">
            Active workspaces assigned to your terminal interface.
          </p>
        </div>

        <Button
          variant="primary"
          className="flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest font-title shadow-lg shadow-brand-accent/20"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} strokeWidth={3} />
          Initialize Project
        </Button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-2xl flex items-center gap-3 font-bold uppercase tracking-wider animate-pulse">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-3">
          <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-terminal-sm font-terminal text-grey-custom dark:text-grey-custom-dark uppercase tracking-[0.2em] animate-pulse">
            Syncing workspace cores...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-grid-light dark:border-border-grid rounded-3xl bg-bg-card-light/30 dark:bg-bg-card-dark/20 backdrop-blur-sm">
          <FolderKanban
            className="mx-auto text-slate-400 dark:text-slate-600 mb-4"
            size={48}
          />
          <p className="text-subtitle font-title text-grey-custom dark:text-grey-custom-dark uppercase tracking-widest mb-1">
            No active projects found
          </p>
          <p className="text-xs text-grey-custom dark:text-grey-custom-dark italic">
            Initialize your first mainframe deployment to start tracking logs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/60 rounded-3xl p-6 flex flex-col justify-between hover:border-brand-accent/50 dark:hover:border-brand-accent/50 transition-all hover:shadow-[0_15px_40px_rgba(251,191,36,0.03)] group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-bg-sub-light dark:bg-bg-sub-dark rounded-2xl border border-border-grid-light/50 dark:border-border-grid/20 text-slate-600 dark:text-brand-accent group-hover:scale-105 group-hover:bg-brand-accent group-hover:text-black dark:group-hover:text-black transition-all duration-300">
                    <FolderKanban size={20} />
                  </div>
                  <div className="flex items-center gap-1.5 text-terminal-sm font-terminal text-grey-custom dark:text-grey-custom-dark uppercase tracking-wider">
                    <Calendar
                      size={13}
                      className="text-grey-custom dark:text-grey-custom-dark"
                    />
                    {new Date(project.createdAt).toLocaleDateString([], {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <h3 className="text-title-card font-title text-black dark:text-white uppercase tracking-tight mb-2 group-hover:text-brand-accent dark:group-hover:text-brand-accent transition-colors duration-200">
                  {project.name}
                </h3>
                <p className="text-subtitle text-grey-custom dark:text-grey-custom-dark line-clamp-3 mb-6 font-body leading-relaxed">
                  {project.description ||
                    "No core log description supplied for this mainframe ecosystem."}
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <Button
                  variant="primary"
                  className="w-full py-3 text-terminal-sm uppercase tracking-widest font-title"
                  onClick={() => navigate(`/projects/${project.id}/kanban`)}
                >
                  Access Board
                </Button>
                <Button
                  variant="secondary"
                  className="w-full py-2.5 text-terminal-sm uppercase tracking-widest font-title flex items-center justify-center gap-2 border border-slate-700/40"
                  onClick={() => setSelectedProject(project)}
                >
                  PROJECT INFO
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={() => fetchProjects(true)}
      />

      {selectedProject && (
        <ProjectDetailsModal
          project={
            projects.find((p) => p.id === selectedProject.id) || selectedProject
          }
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
          onProjectUpdated={() => fetchProjects(true)}
        />
      )}
    </>
  );
};

export default Projects;
