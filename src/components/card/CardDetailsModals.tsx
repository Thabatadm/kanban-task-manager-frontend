import React, { useState } from "react";
import { Button } from "../ui/Button";
import { cardService } from "../../services/cardService";
import { useAuth } from "../../hooks/useAuth";
import {
  X,
  Trash2,
  ShieldAlert,
  Calendar,
  User as UserIcon,
  Cpu,
} from "lucide-react";
import type {
  CardResponse,
  CardStatus,
  CardPriority,
  UpdateCardRequest,
} from "../../types/card";
import type { ProjectUserBackend } from "../../types/project";

interface CardDetailModalProps {
  card: CardResponse;
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onCardUpdated: () => void;
  projectMembers: ProjectUserBackend[];
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  projectId,
  onCardUpdated,
  projectMembers = [],
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [status, setStatus] = useState<CardStatus>(card.status);
  const [priority, setPriority] = useState<CardPriority>(card.priority);
  const [assigneeId, setAssigneeId] = useState<number | "">(
    card.assignee ? card.assignee.id : "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dueDate, setDueDate] = useState<string>(() => {
    if (card.dueDate && typeof card.dueDate === "string") {
      return card.dueDate.substring(0, 10);
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const currentUserEmail = user?.email || "";
  const currentMember = projectMembers.find(
    (member) =>
      member.user?.email?.toLowerCase() === currentUserEmail.toLowerCase(),
  );
  const isMaster = currentMember?.role === "MASTER";

  if (!isOpen) return null;

  const formatTerminalDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("CRITICAL ERROR: Title matrix integrity can't be vacant.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let formattedDueDate: string | null = "";
      if (dueDate) {
        const [year, month, day] = dueDate.split("-").map(Number);
        const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));

        formattedDueDate = dateObj.toISOString();
      }

      const updates: UpdateCardRequest = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId === "" ? null : assigneeId,
        dueDate: formattedDueDate,
      };

      await cardService.updateCard(projectId, card.id, updates);
      onCardUpdated();
      onClose();
    } catch (err) {
      console.error("Card update diagnostic crash:", err);
      setError("MUTATION FAILURE: Update transmission blocked.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isMaster) {
      setError(
        "SECURITY VIOLATION: Only MASTER agents can invoke purge protocols.",
      );
      return;
    }

    if (
      !window.confirm(
        "CRITICAL PROTOCOL: Are you certain you want to purge this record unit?",
      )
    )
      return;

    try {
      setLoading(true);
      await cardService.deleteCard(card.id, projectId);
      onCardUpdated();
      onClose();
    } catch (err) {
      console.error("Card destruction error:", err);
      setError("PURGE ABORTED: Root security bypass denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md box-border">
      <div className="w-full max-w-lg bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid rounded-3xl p-5 sm:p-6 shadow-2xl font-main relative animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-2rem)] overflow-y-auto box-border min-w-0">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-dashed border-border-grid-light dark:border-border-grid/40 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-terminal bg-slate-800 text-grey-custom px-2 py-0.5 border border-slate-700 rounded-md flex-shrink-0">
              NODE #{card.id}
            </span>
            <h2 className="text-xs sm:text-sm font-title text-black dark:text-white uppercase tracking-widest truncate">
              Diagnostic / <span className="text-indigo-400">Modify</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-grey-custom hover:text-black dark:hover:text-white transition-colors p-1 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-terminal uppercase tracking-wider animate-pulse flex items-center gap-2 w-full box-border break-words">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span className="w-full min-w-0">{error}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 w-full">
          <div>
            <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
              Title Matrix
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-grid-light dark:border-slate-800 bg-bg-sub-light dark:bg-bg-sub-dark text-sm text-black dark:text-white uppercase tracking-tight focus:outline-none focus:border-indigo-500 transition-colors box-border"
            />
          </div>

          <div>
            <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
              System Logs
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border-grid-light dark:border-slate-800 bg-bg-sub-light dark:bg-bg-sub-dark text-sm text-black dark:text-white focus:outline-none focus:border-indigo-500 transition-colors box-border resize-none"
            />
          </div>

          <div className="p-3 bg-bg-sub-light/60 dark:bg-bg-sub-dark/30 border border-border-grid-light/50 dark:border-border-grid/20 rounded-xl space-y-2 w-full box-border">
            <div className="flex items-center gap-2 text-[10px] font-terminal text-grey-custom uppercase tracking-wider">
              <Cpu size={12} className="text-indigo-400/70 flex-shrink-0" />
              <span>System Registry Logs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-terminal text-grey-custom w-full">
              <div className="break-words w-full">
                <span className="text-grey-custom/50">INITIALIZED:</span>{" "}
                <span className="text-black dark:text-slate-300 block sm:inline">
                  {formatTerminalDate(card.createdAt)}
                </span>
              </div>
              <div className="break-words w-full">
                <span className="text-grey-custom/50">LAST MUTATION:</span>{" "}
                <span className="text-black dark:text-slate-300 block sm:inline">
                  {formatTerminalDate(card.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
                Sector Allocation
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CardStatus)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-grid-light dark:border-slate-800 bg-bg-sub-light dark:bg-bg-sub-dark text-xs text-black dark:text-white font-terminal focus:outline-none focus:border-indigo-500 box-border"
              >
                <option value="TO_DO">BACKLOG / TO DO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="REVIEW">UNDER REVIEW</option>
                <option value="DONE">SYSTEM DONE</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
                Threat Level (Priority)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CardPriority)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-grid-light dark:border-slate-800 bg-bg-sub-light dark:bg-bg-sub-dark text-xs text-black dark:text-white font-terminal focus:outline-none focus:border-indigo-500 box-border"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
              Assigned Agent
            </label>
            <div className="relative w-full">
              <select
                value={assigneeId}
                onChange={(e) =>
                  setAssigneeId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-border-grid-light dark:border-slate-800 bg-bg-sub-light dark:bg-bg-sub-dark text-xs text-black dark:text-white font-terminal focus:outline-none focus:border-indigo-500 appearance-none box-border"
              >
                <option value="">UNASSIGNED / VACANT</option>
                {projectMembers.map((member) => {
                  const innerUser = member.user;

                  if (!innerUser || !innerUser.id) return null;

                  return (
                    <option key={innerUser.id} value={innerUser.id}>
                      {innerUser.name.toUpperCase()}{" "}
                      {innerUser.lastName?.toUpperCase() || ""} ({member.role})
                    </option>
                  );
                })}
              </select>
              <UserIcon
                size={14}
                className="absolute left-3.5 top-3.5 text-grey-custom pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
              Expiration Timeline (Due Date)
            </label>
            <div className="relative w-full">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-border-grid-light dark:border-slate-800 bg-bg-sub-light dark:bg-bg-sub-dark text-xs text-black dark:text-white font-terminal focus:outline-none focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark] box-border"
              />
              <Calendar
                size={14}
                className="absolute left-3.5 top-3.5 text-grey-custom pointer-events-none"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-dashed border-border-grid-light dark:border-border-grid/40 w-full">
            {isMaster ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="flex items-center justify-center gap-1.5 px-3 py-2 border border-transparent hover:border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-title uppercase tracking-wider transition-all order-2 sm:order-1"
              >
                <Trash2 size={13} />
                Purge Unit
              </button>
            ) : (
              <div className="hidden sm:block order-1" />
            )}

            <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-4 py-2 text-xs font-title uppercase tracking-widest flex-1 sm:flex-none"
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="px-4 py-2 text-xs font-title uppercase tracking-widest flex-1 sm:flex-none"
              >
                {loading ? "Overwriting..." : "Commit Mutate"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
