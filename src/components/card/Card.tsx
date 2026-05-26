import React from "react";
import { Calendar, User as UserIcon } from "lucide-react";
import type {
  CardResponse,
  CardPriority,
  CardStatus,
} from "./../../types/card";

interface CardProps {
  card: CardResponse;
  onClick?: (card: CardResponse) => void;
}

const getPriorityStyles = (priority: CardPriority) => {
  switch (priority) {
    case "URGENT":
      return {
        badge:
          "border-red-500 text-red-400 bg-red-500/10 group-hover:border-red-400",
        cardBorder: "border-l-3 border-l-red-500/80 dark:border-l-red-500/90",
      };
    case "HIGH":
      return {
        badge:
          "border-orange-500 text-orange-400 bg-orange-500/10 group-hover:border-orange-400",
        cardBorder:
          "border-l-3 border-l-orange-500/80 dark:border-l-orange-500/90",
      };
    case "MEDIUM":
      return {
        badge:
          "border-indigo-500 text-indigo-400 bg-indigo-500/10 group-hover:border-indigo-400",
        cardBorder:
          "border-l-3 border-l-indigo-500/80 dark:border-l-indigo-500/90",
      };
    case "LOW":
    default:
      return {
        badge:
          "border-slate-500 text-slate-400 bg-slate-500/10 group-hover:border-slate-400",
        cardBorder:
          "border-l-3 border-l-slate-500/50 dark:border-l-slate-700/80",
      };
  }
};

const getStatusCardStyles = (status: CardStatus) => {
  switch (status) {
    case "TO_DO":
      return {
        wrapper:
          "hover:border-slate-400 dark:hover:border-slate-500 bg-slate-500/5 dark:bg-slate-950/30",
        accentText: "text-slate-600 dark:text-slate-300 font-semibold",
        iconColor: "text-slate-500 dark:text-slate-300",
      };
    case "IN_PROGRESS":
      return {
        wrapper:
          "hover:border-indigo-400 dark:hover:border-indigo-500 bg-indigo-500/4 dark:bg-indigo-950/30",
        accentText: "text-indigo-600 dark:text-indigo-300 font-semibold",
        iconColor: "text-indigo-600 dark:text-indigo-300",
      };
    case "REVIEW":
      return {
        wrapper:
          "hover:border-orange-400 dark:hover:border-orange-500 bg-orange-500/4 dark:bg-orange-950/30",
        accentText: "text-orange-600 dark:text-orange-300 font-semibold",
        iconColor: "text-orange-600 dark:text-orange-300",
      };
    case "DONE":
      return {
        wrapper:
          "hover:border-emerald-400 dark:hover:border-emerald-500 bg-emerald-500/4 dark:bg-emerald-950/30",
        accentText: "text-emerald-600 dark:text-emerald-300 font-semibold",
        iconColor: "text-emerald-600 dark:text-emerald-300",
      };
    default:
      return {
        wrapper:
          "hover:border-slate-300 dark:hover:border-slate-700 bg-bg-card-light dark:bg-bg-card-dark",
        accentText: "text-black dark:text-white",
        iconColor: "text-brand-accent",
      };
  }
};

export const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const formattedDate = card.dueDate
    ? new Date(card.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "NO TARGET";

  const statusStyles = getStatusCardStyles(card.status);
  const priorityStyles = getPriorityStyles(card.priority);
  const positionBorderClass = `${priorityStyles.cardBorder} border-t border-r border-b border-border-grid-light dark:border-border-grid/50`;

  return (
    <div
      onClick={() => onClick?.(card)}
      className={`group relative flex flex-col gap-3 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer font-main overflow-hidden ${statusStyles.wrapper} ${positionBorderClass}`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[4px] transition-all duration-200 opacity-0 group-hover:opacity-100 ${
          card.status === "REVIEW"
            ? "bg-orange-500"
            : card.status === "TO_DO"
              ? "bg-slate-500"
              : card.status === "IN_PROGRESS"
                ? "bg-indigo-500"
                : card.status === "DONE"
                  ? "bg-emerald-500"
                  : "bg-slate-500"
        }`}
      />

      <div className="flex items-center justify-between">
        <span
          className={`text-[9px] font-terminal uppercase tracking-wider px-2 py-0.5 rounded border transition-colors duration-200 ${priorityStyles.badge}`}
        >
          {card.priority}
        </span>
      </div>

      <div className="space-y-1">
        <h4
          className={`text-sm font-title text-black dark:text-white transition-colors line-clamp-1 uppercase tracking-tight ${statusStyles.accentText}`}
        >
          {card.title}
        </h4>
        <p className="text-xs text-grey-custom dark:text-grey-custom-dark font-body line-clamp-2 italic leading-relaxed">
          {card.description || "No specification provided."}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-dashed border-border-grid-light dark:border-border-grid/30 text-[11px] font-terminal">
        <div className="flex items-center gap-1 text-grey-custom dark:text-grey-custom-dark">
          <Calendar size={12} className={statusStyles.iconColor} />
          <span className={!card.dueDate ? "text-grey-custom/40 italic" : ""}>
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-1.5 max-w-[50%]">
          {card.assignee ? (
            <div
              className="flex items-center gap-1 truncate bg-bg-sub-light dark:bg-bg-sub-dark px-2 py-0.5 rounded-lg border border-border-grid-light dark:border-slate-800/80 group-hover:border-indigo-500/20 transition-colors"
              title={`${card.assignee.name} ${card.assignee.lastName || ""}`}
            >
              <UserIcon size={10} className="text-brand-accent" />
              <span className="truncate text-black dark:text-white uppercase text-[10px] tracking-tight">
                {card.assignee.name}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-grey-custom/40 italic tracking-tighter">
              UNASSIGNED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
