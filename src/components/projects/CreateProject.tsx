import React, { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import {
  X,
  FolderPlus,
  Edit3,
  UserMinus,
  Check,
  Trash2,
  Users,
} from "lucide-react";
import { projectService } from "../../services/projectService";
import { userService } from "../../services/userService";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectMember,
  ExtendedProject,
  ProjectUserBackend,
} from "../../types/project";

interface LocalProject {
  id: number;
  name: string;
  description: string;
}

interface ProjectUser {
  id: number;
  project: LocalProject;
  role: "MASTER" | "DEVELOPER";
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
  projectToEdit?: ExtendedProject | null;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  projectToEdit = null,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentMembers, setCurrentMembers] = useState<ProjectUserBackend[]>(
    [],
  );
  const [systemUsers, setSystemUsers] = useState<ProjectMember[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [userRoles, setUserRoles] = useState<
    Record<number, "MASTER" | "DEVELOPER">
  >({});
  const [fetchingUsers, setFetchingUsers] = useState(false);

  const isEditMode = !!projectToEdit;

  useEffect(() => {
    let timeoutId: number | undefined;

    const initializeModal = async () => {
      if (!isOpen) return;

      try {
        setError("");
        setSelectedUserIds([]);

        if (isEditMode && projectToEdit) {
          setName(projectToEdit.name);
          setDescription(projectToEdit.description || "");

          const initialMembers: ProjectUserBackend[] = (
            projectToEdit.projectUsers ||
            projectToEdit.members ||
            []
          ).map((m) => {
            return {
              id: m.id,
              role: m.role,
              userId: m.user?.id || m.userId || 0,
              user: m.user,
            };
          });

          setCurrentMembers(initialMembers);

          setFetchingUsers(true);
          const allUsers: ProjectMember[] = await userService.getMembers();

          const currentActiveUserIds = initialMembers.map((m) => m.userId);
          const filteredUsers = allUsers.filter(
            (u) => !currentActiveUserIds.includes(u.id),
          );

          setSystemUsers(filteredUsers);

          const defaultRoles: Record<number, "MASTER" | "DEVELOPER"> = {};
          filteredUsers.forEach((u) => {
            defaultRoles[u.id] = "DEVELOPER";
          });
          setUserRoles(defaultRoles);
        } else {
          setName("");
          setDescription("");
          setCurrentMembers([]);
          setSystemUsers([]);
        }
      } catch (err) {
        console.error("Error synchronizing project records:", err);
        setError("ERROR SYNCHRONIZING THE AGENT DATABASE.");
      } finally {
        setFetchingUsers(false);
      }
    };

    if (isOpen) {
      timeoutId = window.setTimeout(() => {
        initializeModal();
      }, 0);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen, projectToEdit, isEditMode]);

  if (!isOpen) return null;

  const handleStageDeleteMember = async (relation: ProjectUser) => {
    if (!projectToEdit?.id) {
      console.error("Operation aborted: projectToEdit.id does not exist.");
      return;
    }

    const targetUserId = relation.id;
    const targetProjectId = Number(projectToEdit.id);

    if (!targetUserId) {
      setError(`CRITICAL ERROR: User ID could not be determined.`);
      return;
    }

    const activeMatch = currentMembers.find((m) => m.userId === targetUserId);
    const userData = activeMatch?.user;

    const confirmDelete = window.confirm(
      `WARNING: Are you sure you want to remove this agent from the project?`,
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError("");

      await projectService.deleteProjectMember(targetProjectId, targetUserId);
      setCurrentMembers((prev) =>
        prev.filter((m) => m.userId !== targetUserId),
      );
      setSelectedUserIds((prev) => prev.filter((id) => id !== targetUserId));

      const backupUser: ProjectMember = {
        id: targetUserId,
        name: userData?.name || "Agent",
        lastName: userData?.lastName || `#${targetUserId}`,
        email: userData?.email || "N/A",
      };

      setSystemUsers((prev) => {
        if (prev.some((u) => u.id === targetUserId)) return prev;
        return [...prev, backupUser];
      });

      const allUsers: ProjectMember[] = await userService.getMembers();
      setCurrentMembers((currentUpToDate) => {
        const remainingActiveUserIds = currentUpToDate.map((m) => m.userId);
        const updatedSystemUsers = allUsers.filter(
          (u) => !remainingActiveUserIds.includes(u.id),
        );
        setSystemUsers(updatedSystemUsers);
        return currentUpToDate;
      });
    } catch (err) {
      console.error("Error in the direct member deletion:", err);
      setError(
        `ERROR 400: The server rejected the removal of user #${targetUserId}.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleRoleChange = (userId: number, role: "MASTER" | "DEVELOPER") => {
    setUserRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const handleDeleteProject = async () => {
    if (!projectToEdit) return;
    if (
      !window.confirm(
        "CRITICAL WARNING: A complete deletion of this workspace will be performed. Proceed?",
      )
    )
      return;

    try {
      setLoading(true);
      await projectService.deleteProject(projectToEdit.id);
      onProjectCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("CRITICAL ERROR IN THE PROJECT DELETION ROUTINE.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditMode && projectToEdit) {
        const updatedProject: UpdateProjectRequest = { name, description };
        await projectService.updateProject(projectToEdit.id, updatedProject);

        const addRequests = selectedUserIds.map((userId) =>
          projectService.addProjectMember(projectToEdit.id, {
            userId: userId,
            role: userRoles[userId] || "DEVELOPER",
          }),
        );
        await Promise.all(addRequests);
      } else {
        const newProject: CreateProjectRequest = {
          name,
          description,
          developerIds: [],
        };
        await projectService.createProject(newProject);
      }

      onProjectCreated();
      onClose();
    } catch (err) {
      console.error("Error processing the form:", err);
      setError("ERROR SAVING THE MASTER CONFIGURATION.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/60 rounded-3xl p-8 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden font-main">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-grey-custom hover:text-black dark:hover:text-white hover:bg-bg-sub-light dark:hover:bg-bg-sub-dark rounded-xl transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 mb-5 flex-shrink-0">
          <div
            className={`p-3 rounded-2xl text-white shadow-lg ${isEditMode ? "bg-indigo-600 shadow-indigo-600/20" : "bg-brand-accent text-slate-950 shadow-brand-accent/20"}`}
          >
            {isEditMode ? <Edit3 size={22} /> : <FolderPlus size={22} />}
          </div>
          <div>
            <h2 className="text-title-main font-title text-black dark:text-white uppercase tracking-tighter">
              {isEditMode ? (
                <>
                  Workspace <span className="text-indigo-500">Mainframe</span>
                </>
              ) : (
                <>
                  New <span className="text-brand-accent">Project</span>
                </>
              )}
            </h2>
            <p className="text-grey-custom dark:text-grey-custom-dark text-xs font-body italic">
              Configure the main specifications and modify the cluster
              properties.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 overflow-y-auto pr-1 min-h-0"
        >
          <Input
            label="Project Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="w-full space-y-1">
            <label className="block text-xs font-title text-grey-custom dark:text-grey-custom-dark uppercase tracking-tighter ml-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              className="w-full px-5 py-3 bg-bg-sub-light dark:bg-bg-sub-dark border border-border-grid-light dark:border-border-grid/50 rounded-xl text-black dark:text-white focus:ring-2 focus:ring-brand-accent outline-none transition-all text-sm resize-none font-body"
            />
          </div>

          {isEditMode && (
            <div className="space-y-4 pt-4 border-t border-dashed border-border-grid-light dark:border-border-grid/40">
              <div className="space-y-2">
                <label className="block text-terminal-sm font-terminal uppercase tracking-wider text-indigo-500 font-bold">
                  Active Agents at the Station ({currentMembers.length})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1">
                  {currentMembers.length === 0 ? (
                    <p className="col-span-2 text-[11px] font-body text-grey-custom dark:text-grey-custom-dark italic py-2 text-center bg-bg-sub-light dark:bg-bg-sub-dark/40 rounded-xl border border-border-grid-light dark:border-border-grid/30">
                      No active entities deployed at this project node.
                    </p>
                  ) : (
                    currentMembers.map((member) => {
                      const u = member.user;
                      const displayName = u
                        ? `${u.name} ${u.lastName}`.trim()
                        : `Agente #${member.userId}`;

                      const projectPayload: LocalProject = {
                        id: Number(projectToEdit?.id || 0),
                        name: projectToEdit?.name || "",
                        description: projectToEdit?.description || "",
                      };

                      const projectUserPayload: ProjectUser = {
                        id: member.userId,
                        project: projectPayload,
                        role: member.role,
                      };

                      return (
                        <div
                          key={String(member.userId)}
                          className="flex items-center justify-between p-2.5 bg-bg-main-light dark:bg-bg-main-dark border border-border-grid-light dark:border-border-grid/50 rounded-xl"
                        >
                          <div className="truncate max-w-[80%]">
                            <p className="text-xs font-title text-black dark:text-white truncate">
                              {displayName}
                            </p>
                            <span className="text-[9px] font-terminal uppercase bg-bg-sub-dark px-1.5 py-0.5 rounded text-brand-accent border border-brand-accent/20">
                              {member.role}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleStageDeleteMember(projectUserPayload)
                            }
                            className="text-grey-custom hover:text-white p-1 rounded-lg hover:bg-red-500 transition-colors"
                            title="Remove agent from project"
                          >
                            <UserMinus size={15} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-terminal-sm font-terminal uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                  <Users size={15} /> Deploy New Sector Units (
                  {selectedUserIds.length} Selected)
                </label>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 border border-border-grid-light dark:border-border-grid/40 p-2 rounded-xl bg-bg-sub-light/50 dark:bg-bg-sub-dark/30">
                  {fetchingUsers ? (
                    <p className="text-xs font-terminal text-grey-custom text-center py-4 animate-pulse">
                      Scanning data nodes of the infrastructure...
                    </p>
                  ) : systemUsers.length === 0 ? (
                    <p className="text-xs font-body text-grey-custom text-center py-4 italic">
                      All instances of the network are already linked to this
                      cluster.
                    </p>
                  ) : (
                    systemUsers.map((user: ProjectMember) => {
                      const isSelected = selectedUserIds.includes(user.id);
                      const currentRole = userRoles[user.id] || "DEVELOPER";
                      const fullName = user.lastName
                        ? `${user.name} ${user.lastName}`
                        : user.name;

                      return (
                        <div
                          key={user.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                            isSelected
                              ? "bg-indigo-500/10 border-indigo-500/50"
                              : "bg-bg-main-light dark:bg-bg-main-dark border-border-grid-light dark:border-border-grid/60 hover:border-grey-custom"
                          }`}
                        >
                          <div
                            className="truncate max-w-[50%] cursor-pointer"
                            onClick={() => toggleUserSelection(user.id)}
                          >
                            <p className="text-xs font-title text-black dark:text-white truncate">
                              {fullName}
                            </p>
                            <p className="text-[10px] text-grey-custom dark:text-grey-custom-dark truncate font-terminal">
                              {user.email}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={currentRole}
                              disabled={!isSelected}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value as "MASTER" | "DEVELOPER",
                                )
                              }
                              className={`text-[10.5px] font-terminal uppercase border tracking-wider px-2 py-0.5 rounded transition-all outline-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                                isSelected
                                  ? "border-indigo-500 text-indigo-400 bg-slate-900"
                                  : "border-border-grid-light dark:border-slate-700 text-grey-custom bg-transparent"
                              }`}
                            >
                              <option
                                value="DEVELOPER"
                                className="dark:bg-slate-900"
                              >
                                DEV
                              </option>
                              <option
                                value="MASTER"
                                className="dark:bg-slate-900"
                              >
                                MASTER
                              </option>
                            </select>

                            <div
                              onClick={() => toggleUserSelection(user.id)}
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-indigo-500 border-indigo-500 text-white"
                                  : "border-border-grid-light dark:border-slate-600"
                              }`}
                            >
                              {isSelected && (
                                <Check size={10} strokeWidth={4} />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-terminal-sm rounded-xl text-center font-title uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border-grid-light dark:border-border-grid/40 bg-bg-card-light dark:bg-bg-card-dark flex-shrink-0 mt-auto">
            {isEditMode ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteProject}
                className="flex items-center gap-2 px-3 py-2.5 text-xs uppercase tracking-wider font-title text-red-500 hover:text-white border border-red-500/30 hover:bg-red-600 rounded-xl transition-all"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Delete Node</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-5 py-3 text-xs uppercase tracking-wider font-title border border-border-grid-light dark:border-slate-700/50 dark:bg-bg-sub-dark"
              >
                Abort
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className={`px-6 py-3 text-xs uppercase tracking-wider font-title shadow-lg ${isEditMode ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10" : "bg-brand-accent text-slate-950 hover:bg-brand-accent/90 shadow-brand-accent/10"}`}
              >
                {isEditMode ? "Commit Alterations" : "Deploy Core"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
