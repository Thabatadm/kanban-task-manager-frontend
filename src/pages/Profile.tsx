import React, { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { Button } from "../components/ui/Button";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import { DeleteProfileModal } from "../components/profile/DeleteProfileModal";
import { Link } from "react-router-dom";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  lastName: string;
  username: string;
  projects: {
    id: number;
    role: string;
    project: {
      id: number;
      name: string;
      description?: string;
      createdAt: string;
    };
  }[];
}

export const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setUserProfile(profile);
    } catch (err) {
      setError("ERROR FETCHING USER PROFILE. PLEASE TRY AGAIN.");
      console.error("Fetch Profile Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await userService.getProfile();
        if (isMounted) {
          setUserProfile(profile);
        }
      } catch (err) {
        if (isMounted) {
          setError("ERROR FETCHING USER PROFILE. PLEASE TRY AGAIN.");
          console.error("Fetch Profile Error:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main-light dark:bg-bg-main-dark font-main">
        <div className="text-xl font-title text-brand-accent animate-pulse tracking-widest uppercase">
          Loading Operator Profile...
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main-light dark:bg-bg-main-dark p-4 font-main">
        <div className="max-w-md w-full p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center shadow-[0_0_30px_rgba(239,68,68,0.05)]">
          <p className="text-red-400 font-terminal font-bold uppercase tracking-wider mb-4">
            {error || "ACCESS DENIED"}
          </p>
          <Button
            variant="secondary"
            onClick={fetchUserProfile}
            className="uppercase tracking-wider font-title"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main-light dark:bg-bg-main-dark pt-16 sm:pt-24 p-4 flex flex-col items-center justify-center gap-6 font-main w-full">
      <div className="w-full max-w-2xl bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/60 rounded-3xl p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] box-border">
        <div className="flex flex-col items-center text-center mb-10 pb-8 border-b border-border-grid-light dark:border-border-grid/40 w-full">
          <div className="p-5 rounded-3xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent mb-4 shadow-lg shadow-brand-accent/5 flex-shrink-0">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-title text-black dark:text-white uppercase tracking-wider w-full break-words">
            {userProfile.name}{" "}
            <span className="text-brand-accent">{userProfile.lastName}</span>
          </h1>
          <p className="text-[10px] sm:text-xs font-terminal text-grey-custom dark:text-grey-custom-dark italic mt-2 uppercase tracking-widest w-full">
            Active Operator // ID:{" "}
            <span className="font-mono dark:text-brand-accent">
              {userProfile.id}
            </span>
          </p>
        </div>

        <div className="space-y-4 mb-10 font-body w-full">
          <div className="p-4 bg-bg-main-light/40 dark:bg-bg-main-dark/30 border border-border-grid-light dark:border-border-grid/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0 w-full">
            <span className="text-[11px] font-terminal uppercase font-bold tracking-widest text-grey-custom dark:text-grey-custom-dark flex-shrink-0">
              Full Identity
            </span>
            <span className="text-sm sm:text-base font-medium text-black dark:text-white font-title tracking-wide break-words text-left sm:text-right w-full sm:w-auto">
              {userProfile.name} {userProfile.lastName}
            </span>
          </div>
          <div className="p-4 bg-bg-main-light/40 dark:bg-bg-main-dark/30 border border-border-grid-light dark:border-border-grid/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0 w-full">
            <span className="text-[11px] font-terminal uppercase font-bold tracking-widest text-grey-custom dark:text-grey-custom-dark flex-shrink-0">
              System Email
            </span>
            <span className="text-sm sm:text-base font-medium text-grey-custom dark:text-brand-accent font-mono select-all tracking-wide break-all text-left sm:text-right w-full sm:w-auto">
              {userProfile.email}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full">
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-1/2 py-4 uppercase tracking-wider font-title bg-brand-accent text-slate-950 hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/10 text-xs sm:text-sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            Modify Profile
          </Button>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full sm:w-1/2 py-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all font-title text-xs sm:text-sm uppercase tracking-wider"
          >
            Terminate Account
          </button>
        </div>
      </div>
      {userProfile.projects && userProfile.projects.length > 0 && (
        <div className="w-full max-w-2xl bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/50 rounded-3xl p-6 shadow-sm box-border">
          <h3 className="text-[11px] font-terminal uppercase font-bold tracking-widest text-grey-custom dark:text-grey-custom-dark mb-4">
            // Assigned Core Projects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {userProfile.projects.map((item) => (
              <Link
                key={item.id}
                to={`/projects/${item.project.id}`}
                className="p-3 bg-bg-main-light/50 dark:bg-bg-main-dark/40 border border-border-grid-light dark:border-border-grid/20 rounded-xl text-sm font-medium text-black dark:text-white hover:border-brand-accent/40 hover:text-brand-accent transition-all flex items-center justify-between gap-4 group min-w-0"
              >
                <span className="flex items-center gap-2 font-body tracking-wide group-hover:translate-x-0.5 transition-transform min-w-0 flex-1 break-words">
                  <span className="text-brand-accent/70 group-hover:text-brand-accent transition-colors flex-shrink-0">
                    📁
                  </span>{" "}
                  {item.project.name}
                </span>

                <span className="text-[10px] px-2 py-0.5 bg-bg-sub-dark rounded dark:bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-mono uppercase tracking-wider flex-shrink-0">
                  {item.role}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <EditProfileModal
          currentUser={userProfile}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchUserProfile}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteProfileModal onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
};

export default Profile;
