import React, { useState } from "react";
import { userService } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

interface DeleteProfileModalProps {
  onClose: () => void;
}

export const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await userService.deleteAccount();
      logout();
    } catch (err) {
      setError("ERROR DELETING ACCOUNT. PLEASE TRY AGAIN.");
      console.error("Delete Profile Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-main">
      <div className="w-full max-w-md bg-bg-card-light dark:bg-bg-card-dark border border-red-500/30 dark:border-red-500/20 rounded-3xl p-8 shadow-[0_20px_50px_rgba(239,68,68,0.15)] text-center animate-fade-in">
        <div className="inline-block p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mb-4 animate-bounce">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-title-main font-title text-red-500 uppercase tracking-widest mb-2">
          CRITICAL WARNING
        </h2>

        <p className="text-grey-custom dark:text-grey-custom-dark text-sm font-body italic mb-6">
          You are about to purge this operator profile from the central core.
          This action is irreversible. All data will be terminated.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-terminal-sm font-terminal rounded-xl uppercase tracking-widest animate-pulse">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="w-1/2 uppercase tracking-wider font-title border border-border-grid-light dark:border-slate-700/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            isLoading={loading}
            className="w-1/2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-title uppercase tracking-wider shadow-lg shadow-red-600/20"
          >
            Purge Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
