import React, { useState } from "react";
import { X, Terminal, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { cardService } from "../../services/cardService";
import type {
  CardStatus,
  CardPriority,
  CreateCardRequest,
} from "../../types/card";

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  initialStatus?: CardStatus;
  onCardCreated: () => void;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({
  isOpen,
  onClose,
  projectId,
  initialStatus = "TO_DO",
  onCardCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CardStatus>(initialStatus);
  const [priority, setPriority] = useState<CardPriority>("MEDIUM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;
  const handleClose = () => {
    setTitle("");
    setDescription("");
    setStatus(initialStatus);
    setPriority("MEDIUM");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("CRITICAL ERROR: Title field cannot be vacant.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload: CreateCardRequest = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      };
      await cardService.createCard(projectId, payload);

      onCardCreated();
      handleClose();
    } catch (err) {
      console.error("Card creation mainframe abort:", err);
      setError("DEPLOYMENT FAILURE: Unable to transmit package to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md box-border">
      <div className="w-full max-w-lg bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid rounded-3xl p-5 sm:p-6 shadow-2xl font-main relative animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-2rem)] overflow-y-auto box-border min-w-0">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-dashed border-border-grid-light dark:border-border-grid/40 w-full">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <Terminal size={18} className="text-brand-accent flex-shrink-0" />
            <h2 className="text-sm sm:text-lg font-title text-black dark:text-white uppercase tracking-tighter truncate">
              Deploy <span className="text-brand-accent">New Task Card</span>
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-grey-custom hover:text-black dark:hover:text-white transition-colors p-1 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-terminal uppercase tracking-wider animate-pulse flex items-center gap-2 w-full box-border break-words">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span className="w-full min-w-0">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.G., PATCH SECURITY CORE V2"
              className="w-full px-4 py-2.5 rounded-xl border border-border-grid-light dark:border-slate-800 bg-bg-sub-light dark:bg-bg-sub-dark text-sm text-black dark:text-white uppercase tracking-tight focus:outline-none focus:border-indigo-500 transition-colors box-border"
            />
          </div>

          <div>
            <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
              Specification Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter routine parameter specifications details..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border-grid-light dark:border-slate-800 bg-bg-sub-light dark:bg-bg-sub-dark text-sm text-black dark:text-white focus:outline-none focus:border-indigo-500 transition-colors box-border resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-[11px] font-terminal uppercase tracking-widest text-grey-custom mb-1.5">
                Sector (Status)
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
                Priority Level
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
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-dashed border-border-grid-light dark:border-border-grid/40 w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="px-4 py-2.5 text-xs font-title uppercase tracking-widest w-full sm:w-auto order-2 sm:order-1"
            >
              Abort
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-title uppercase tracking-widest shadow-lg shadow-brand-accent/10 w-full sm:w-auto order-1 sm:order-2"
            >
              {loading ? "Injecting Data..." : "Execute Deploy"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
