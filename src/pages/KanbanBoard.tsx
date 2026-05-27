import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Card } from "../components/card/Card";
import { CreateCardModal } from "../components/card/CreateCardModal";
import { CardDetailModal } from "../components/card/CardDetailsModals";
import { cardService } from "../services/cardService";
import { projectService } from "../services/projectService";
import type { CardResponse, CardStatus } from "../types/card";
import type { ExtendedProject } from "../types/project";
import {
  Plus,
  Layers,
  Loader2,
  Terminal,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { Button } from "../components/ui/Button";

const COLUMNS: { id: CardStatus; title: string; color: string }[] = [
  {
    id: "TO_DO",
    title: "Backlog / To Do",
    color:
      "border-slate-500/30 text-slate-600 dark:text-slate-400 raw-color-slate-500",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color:
      "border-indigo-500/30 text-indigo-600 dark:text-indigo-400 raw-color-indigo-500",
  },
  {
    id: "REVIEW",
    title: "Under Review",
    color:
      "border-orange-500/30 text-orange-600 dark:text-orange-400 raw-color-orange-500",
  },
  {
    id: "DONE",
    title: "System Done",
    color:
      "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 raw-color-emerald-500",
  },
];

export const KanbanBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const numericProjectId = Number(projectId);
  const navigate = useNavigate();

  const [cards, setCards] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [project, setProject] = useState<ExtendedProject | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CardStatus>("TO_DO");
  const [selectedCard, setSelectedCard] = useState<CardResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadCards = useCallback(async () => {
    if (!numericProjectId) return;
    try {
      setLoading(true);
      setError("");
      const data = await cardService.getCardsByProject(numericProjectId);
      setCards(data.sort((a, b) => a.position - b.position));
    } catch (err) {
      console.error("Data stream sync interrupt:", err);
      setError("CRITICAL FAILURE: Could not sync sector cards.");
    } finally {
      setLoading(false);
    }
  }, [numericProjectId]);

  useEffect(() => {
    if (!numericProjectId) return;

    const loadWorkspaceData = async () => {
      try {
        await loadCards();
        const allProjects = await projectService.getProjects();
        const currentProject = allProjects.find(
          (p) => p.id === numericProjectId,
        );
        if (currentProject) {
          setProject(currentProject);
        }
      } catch (err) {
        console.error("Critical board/project sync crash:", err);
        setError(
          "CRITICAL CORE FAILURE: Failure syncing cluster stream dependencies.",
        );
      }
    };

    void loadWorkspaceData();
  }, [numericProjectId, loadCards]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceStatus = source.droppableId as CardStatus;
    const destStatus = destination.droppableId as CardStatus;
    const cardId = Number(draggableId);
    const previousCards = [...cards];

    const sourceColumn = cards
      .filter((c) => c.status === sourceStatus)
      .sort((a, b) => a.position - b.position);
    const destColumn =
      sourceStatus === destStatus
        ? sourceColumn
        : cards
            .filter((c) => c.status === destStatus)
            .sort((a, b) => a.position - b.position);

    const [movedCard] = sourceColumn.splice(source.index, 1);
    movedCard.status = destStatus;

    destColumn.splice(destination.index, 0, movedCard);

    sourceColumn.forEach((card, idx) => {
      card.position = idx;
    });
    destColumn.forEach((card, idx) => {
      card.position = idx;
    });

    const updatedCards = cards.map((c) => {
      const matchInSource = sourceColumn.find((sc) => sc.id === c.id);
      const matchInDest = destColumn.find((dc) => dc.id === c.id);
      return matchInDest || matchInSource || c;
    });

    setCards(updatedCards.sort((a, b) => a.position - b.position));

    try {
      await cardService.updateCard(numericProjectId, cardId, {
        status: destStatus,
        position: destination.index,
        dueDate: movedCard.dueDate,
      });
      const data = await cardService.getCardsByProject(numericProjectId);
      setCards(data.sort((a, b) => a.position - b.position));
    } catch (err) {
      console.error("Drag transmission failed, reverting mutation:", err);
      setError(
        "MUTATION REJECTED: Server dropped position synchronization packets.",
      );
      setCards(previousCards);
    }
  };

  const handleOpenCreate = (status: CardStatus) => {
    setSelectedStatus(status);
    setIsCreateOpen(true);
  };

  const handleCardClick = (card: CardResponse) => {
    setSelectedCard(card);
    setIsDetailOpen(true);
  };

  if (!numericProjectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 font-terminal">
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-2xl max-w-md text-center uppercase tracking-widest mb-4">
          INVALID PARAMETER: No project node specified in mainframe link.
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/projects")}
          className="text-xs uppercase tracking-wider font-title"
        >
          <ArrowLeft size={14} className="mr-2" /> Return to Workspace
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3 font-terminal">
        <Loader2
          className="animate-spin text-brand-accent"
          size={40}
          strokeWidth={2.5}
        />
        <p className="text-xs text-grey-custom uppercase tracking-[0.2em] animate-pulse">
          Synchronizing cluster data streams...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 font-main h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-border-grid-light dark:border-border-grid/40 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="p-2.5 border border-border-grid-light dark:border-slate-800 hover:border-brand-accent/50 bg-bg-card-light dark:bg-bg-card-dark rounded-xl text-grey-custom hover:text-brand-accent transition-all duration-200 group"
            title="Return to projects matrix"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-terminal text-grey-custom dark:text-grey-custom-dark uppercase tracking-widest mb-0.5">
              <Terminal size={12} className="text-brand-accent" />
              <span>ID PROJECT / #{numericProjectId}</span>
            </div>
            <h1 className="text-title-main font-title text-black dark:text-white uppercase tracking-tighter max-w-xl truncate">
              {project ? (
                <>
                  Project /{" "}
                  <span className="text-brand-accent">{project.name}</span>
                </>
              ) : (
                <>
                  Task <span className="text-grey-custom/40">Workspace</span>
                </>
              )}
            </h1>
          </div>
        </div>

        <Button
          variant="primary"
          className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest font-title shadow-md shadow-brand-accent/10"
          onClick={() => handleOpenCreate("TO_DO")}
        >
          <Plus size={14} strokeWidth={3} /> Deploy Task
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-terminal text-center uppercase tracking-widest animate-pulse">
          {error}
        </div>
      )}

      <div className="flex justify-end mt-2">
        <button
          onClick={() =>
            project && navigate(`/projects/${project.id}/calendar`)
          }
          className="flex items-center gap-2 px-5 py-3 border border-dashed border-border-grid-light dark:border-border-grid hover:border-brand-accent/60 bg-bg-card-light dark:bg-bg-card-dark text-grey-custom dark:text-grey-custom-dark hover:text-brand-accent rounded-xl text-xs font-terminal uppercase tracking-wider transition-all duration-200 group shadow-sm shadow-black/5"
        >
          <Calendar
            size={14}
            className="group-hover:rotate-6 transition-transform"
          />
          <span>Open Global Schedule Matrix</span>
        </button>
      </div>

      {isCreateOpen && (
        <CreateCardModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          projectId={numericProjectId}
          initialStatus={selectedStatus}
          onCardCreated={loadCards}
        />
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start overflow-x-auto pb-4">
          {COLUMNS.map((column) => {
            const columnCards = cards.filter((c) => c.status === column.id);

            return (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col max-h-[72vh] w-full bg-bg-sub-light/40 dark:bg-bg-sub-dark/10 border border-border-grid-light dark:border-border-grid/40 rounded-2xl p-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed border-border-grid-light dark:border-border-grid/40 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-title uppercase tracking-tighter ${column.color.split(" ")[1]}`}
                        >
                          {column.title}
                        </span>
                        <span className="text-[10px] font-terminal px-1.5 py-0.2 bg-bg-sub-light dark:bg-bg-sub-dark border dark:border-slate-800 rounded-md text-grey-custom">
                          {columnCards.length}
                        </span>
                      </div>

                      <button
                        className="p-1 hover:bg-bg-sub-light dark:hover:bg-bg-sub-dark border border-transparent hover:border-border-grid-light dark:hover:border-slate-700/50 rounded-lg text-grey-custom hover:text-indigo-400 transition-all"
                        title={`Deploy new card to ${column.title}`}
                        onClick={() => handleOpenCreate(column.id)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 min-h-[150px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {columnCards.map((card, index) => (
                        <Draggable
                          key={card.id}
                          draggableId={String(card.id)}
                          index={index}
                        >
                          {(draggableProvided) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              className="transition-transform duration-75 select-none"
                            >
                              <Card card={card} onClick={handleCardClick} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columnCards.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-border-grid-light dark:border-border-grid/20 rounded-xl bg-bg-main-light/20 dark:bg-bg-main-dark/5">
                          <Layers
                            size={16}
                            className="text-grey-custom/30 mb-1"
                          />
                          <p className="text-[10px] font-body text-grey-custom/50 italic text-center">
                            No active units in sector.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

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
          onCardUpdated={loadCards}
          projectMembers={project?.projectUsers || project?.members || []}
        />
      )}
    </div>
  );
};
