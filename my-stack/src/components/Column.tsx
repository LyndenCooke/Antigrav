import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Tool, ColumnType } from "../types";
import { ToolCard } from "./ToolCard";

const columnCopy: Record<ColumnType, { label: string; color: string }> = {
  free: { label: "Free", color: "text-free" },
  paid: { label: "Paid", color: "text-accent-secondary" },
};

type ColumnProps = {
  column: ColumnType;
  tools: Tool[];
  onRemove: (id: string) => void;
  onCostChange: (id: string, cost: number) => void;
};

export const Column = ({ column, tools, onRemove, onCostChange }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id: column });

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`text-xs uppercase tracking-[0.3em] ${columnCopy[column].color}`}
        >
          {columnCopy[column].label}
        </span>
        <span className="text-xs text-text-secondary">
          {tools.length} tools
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex min-h-[200px] flex-1 flex-col gap-3 rounded-xl border border-border bg-[#111111]/60 p-4"
      >
        <SortableContext
          items={tools.map((tool) => tool.id)}
          strategy={verticalListSortingStrategy}
        >
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onRemove={onRemove}
              onCostChange={onCostChange}
            />
          ))}
        </SortableContext>
        {tools.length === 0 && (
          <div className="flex h-full items-center justify-center text-xs text-text-secondary">
            Drag tools here
          </div>
        )}
      </div>
    </div>
  );
};
