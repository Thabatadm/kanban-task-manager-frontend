import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { cardService } from "../services/cardService";
import { projectService } from "../services/projectService";
import { CardDetailModal } from "../components/card/CardDetailsModals";
import type { CardResponse } from "../types/card";
import type { ExtendedProject } from "../types/project";
import { ArrowLeft, Loader2, Terminal } from "lucide-react";

export const KanbanCalendar: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const numericProjectId = Number(projectId);
  const navigate = useNavigate();

  const [cards, setCards] = useState<CardResponse[]>([]);
  const [project, setProject] = useState<ExtendedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCard, setSelectedCard] = useState<CardResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const executeDataFetch = async () => {
      if (!numericProjectId) return;
      try {
        const cardData = await cardService.getCardsByProject(numericProjectId);
        const allProjects = await projectService.getProjects();
        const currentProject = allProjects.find(
          (p) => p.id === numericProjectId,
        );

        if (isMounted) {
          setCards(cardData);
          if (currentProject) setProject(currentProject);
          setLoading(false);
        }
      } catch (err) {
        console.error("Calendar stream sync crash:", err);
        if (isMounted) {
          setError(
            "CRITICAL CORE FAILURE: Failure syncing calendar stream dependencies.",
          );
          setLoading(false);
        }
      }
    };

    void executeDataFetch();

    return () => {
      isMounted = false;
    };
  }, [numericProjectId]);

  const calendarEvents = cards
    .filter((card) => card.dueDate)
    .map((card) => {
      let colorHex = "#64748b";
      if (card.priority === "URGENT") colorHex = "#ef4444";
      if (card.priority === "HIGH") colorHex = "#f97316";
      if (card.priority === "MEDIUM") colorHex = "#6366f1";

      return {
        id: String(card.id),
        title: card.title,
        start: card.dueDate,
        backgroundColor: `${colorHex}15`,
        borderColor: `${colorHex}40`,
        textColor: colorHex,
        extendedProps: { rawCard: card },
      };
    });

  const handleRefreshData = async () => {
    if (!numericProjectId) return;
    try {
      const cardData = await cardService.getCardsByProject(numericProjectId);
      setCards(cardData);
    } catch (err) {
      console.error("Failed to re-sync scheduler nodes:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3 font-terminal">
        <Loader2
          className="animate-spin text-brand-accent"
          size={40}
          strokeWidth={2.5}
        />
        <p className="text-xs text-grey-custom uppercase tracking-[0.2em] animate-pulse">
          Loading deployment timeline...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 font-main h-full">
      <div className="flex items-center gap-4 border-b border-dashed border-border-grid-light dark:border-border-grid/40 pb-6">
        <button
          onClick={() => navigate(`/projects/${numericProjectId}`)}
          className="p-2.5 border border-border-grid-light dark:border-slate-800 hover:border-brand-accent/50 bg-bg-card-light dark:bg-bg-card-dark rounded-xl text-grey-custom hover:text-brand-accent transition-all duration-200 group"
          title="Return to board view"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </button>
        <div>
          <div className="flex items-center gap-2 text-[10px] font-terminal text-grey-custom dark:text-grey-custom-dark uppercase tracking-widest mb-0.5">
            <Terminal size={12} className="text-brand-accent" />
            <span>Schedule Matrix / #{numericProjectId}</span>
          </div>
          <h1 className="text-title-main font-title text-black dark:text-white uppercase tracking-tighter max-w-xl truncate">
            {project ? (
              <>
                Timeline /{" "}
                <span className="text-brand-accent">{project.name}</span>
              </>
            ) : (
              <>Schedule Workspace</>
            )}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-terminal text-center uppercase tracking-widest animate-pulse">
          {error}
        </div>
      )}

      <div className="w-full bg-bg-card-light dark:bg-bg-card-dark border border-border-grid-light dark:border-border-grid/40 rounded-2xl p-6 shadow-sm">
        <div className="cyberpunk-calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={(info) => {
              setSelectedCard(info.event.extendedProps.rawCard);
              setIsDetailOpen(true);
            }}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
          />
        </div>
      </div>

      {isDetailOpen && selectedCard && (
        <CardDetailModal
          key={selectedCard.id}
          card={selectedCard}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedCard(null);
          }}
          projectId={numericProjectId}
          onCardUpdated={handleRefreshData}
          projectMembers={project?.projectUsers || project?.members || []}
        />
      )}
    </div>
  );
};
