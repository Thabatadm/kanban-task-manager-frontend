import React, { useState } from "react";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import axios from "axios";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface EditProfileModalProps {
  currentUser: {
    name: string;
    lastName: string;
    email: string;
  };
  onClose: () => void;
  onUpdate: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  onClose,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser.name,
    lastName: currentUser.lastName,
    email: currentUser.email,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isChangingPassword) {
      if (formData.password.length < 8) {
        setError("PASSWORD MUST BE AT LEAST 8 CHARACTERS");
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("ACCESS KEYS DO NOT MATCH");
        setLoading(false);
        return;
      }
    }

    try {
      await userService.updateProfile({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: isChangingPassword ? formData.password : undefined,
      });

      const emailChanged =
        formData.email.toLowerCase().trim() !==
        currentUser.email.toLowerCase().trim();

      if (emailChanged || isChangingPassword) {
        alert("SECURITY NOTICE: Credentials modified. Please log in again.");
        authService.logout();
        return;
      }

      onUpdate();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "FAILED TO UPDATE PROFILE");
      } else {
        setError("AN UNEXPECTED ERROR OCCURRED");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-main box-border">
      <div className="w-full max-w-lg bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/60 rounded-3xl p-5 sm:p-8 shadow-[0_20px_50px_rgba(79,70,229,0.1)] animate-fade-in max-h-[calc(100vh-2rem)] overflow-y-auto box-border min-w-0">
        <div className="mb-6 text-center w-full">
          <h2 className="text-lg sm:text-xl md:text-title-main font-title text-black dark:text-white uppercase tracking-wider break-words">
            {isChangingPassword ? "Update" : "Modify"}{" "}
            <span className="text-brand-accent block sm:inline">
              {isChangingPassword ? "Access Key" : "Operator Profile"}
            </span>
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4 w-full">
          {isChangingPassword ? (
            <div className="space-y-4 animate-fade-in w-full">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="w-full min-w-0">
                  <Input
                    label="New Access Key"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full min-w-0">
                  <Input
                    label="Confirm New Key"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in w-full">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="w-full min-w-0">
                  <Input
                    label="First Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full min-w-0">
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <Input
                  label="System Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text-right w-full">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setError("");
                  }}
                  className="text-xs sm:text-terminal-sm dark:text-brand-accent hover:text-brand-accent underline uppercase tracking-wider font-terminal font-bold transition-all inline-block"
                >
                  [ Change Access Key ]
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-terminal-sm font-terminal rounded-xl text-center uppercase tracking-widest animate-pulse w-full box-border break-words">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
            {isChangingPassword ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsChangingPassword(false);
                  setError("");
                }}
                className="w-full sm:w-1/2 uppercase tracking-wider font-title border border-border-grid-light dark:border-slate-700/50 py-3 order-2 sm:order-1"
              >
                Back to Profile
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="w-full sm:w-1/2 uppercase tracking-wider font-title border border-border-grid-light dark:border-slate-700/50 py-3 order-2 sm:order-1"
              >
                Abort
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full sm:w-1/2 uppercase tracking-wider font-title bg-brand-accent text-slate-950 hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/10 py-3 order-1 sm:order-2"
            >
              {isChangingPassword ? "Apply New Key" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
