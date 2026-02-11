import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { Tool } from "../types";

const logoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;

type ToolCardProps = {
  tool: Tool;
  onRemove: (id: string) => void;
  onCostChange: (id: string, cost: number) => void;
};

export const ToolCard = ({ tool, onRemove, onCostChange }: ToolCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tool.id });
  const [isEditing, setIsEditing] = useState(false);
  const [draftCost, setDraftCost] = useState(tool.cost.toString());
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setDraftCost(tool.cost.toString());
  }, [tool.cost]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const commitCost = () => {
    const value = Number(draftCost);
    onCostChange(tool.id, Number.isFinite(value) ? value : 0);
    setIsEditing(false);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    window.setTimeout(() => onRemove(tool.id), 150);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-lg border border-border bg-panel px-3 py-3 text-sm text-white card-shadow transition hover:bg-panel-hover ${
        isDragging ? "drag-overlay" : ""
      } ${isRemoving ? "animate-fadeOut" : "animate-fadeIn"}`}
    >
      <button
        className="cursor-grab rounded p-1 text-text-secondary hover:bg-black/20 hover:text-white"
        aria-label="Drag tool"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>
      <img
        src={logoUrl(tool.domain)}
        alt={`${tool.name} logo`}
        className="h-8 w-8 rounded-md bg-black/40"
        loading="lazy"
      />
      <div className="flex-1">
        <div className="text-[14px] font-medium">{tool.name}</div>
        <div className="text-xs text-text-secondary">{tool.domain}</div>
      </div>
      {tool.column === "paid" && (
        <div className="flex items-center gap-1 font-mono text-[14px]">
          <span className="text-text-secondary">£</span>
          {isEditing ? (
            <input
              autoFocus
              className="w-20 rounded-md border border-border bg-[#101010] px-2 py-1 text-right font-mono text-[14px] text-white focus:border-accent focus:outline-none"
              value={draftCost}
              onChange={(event) => setDraftCost(event.target.value)}
              onBlur={commitCost}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitCost();
                }
              }}
            />
          ) : (
            <button
              className="rounded px-1 text-white/90 hover:bg-black/20 hover:text-white"
              onClick={(event) => {
                event.stopPropagation();
                setIsEditing(true);
              }}
            >
              {tool.cost.toFixed(2)}
            </button>
          )}
        </div>
      )}
      <button
        className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-danger transition hover:bg-danger/10 md:opacity-0 md:group-hover:opacity-100"
        onClick={(event) => {
          event.stopPropagation();
          handleRemove();
        }}
        aria-label="Remove tool"
      >
        ×
      </button>
    </div>
  );
};
