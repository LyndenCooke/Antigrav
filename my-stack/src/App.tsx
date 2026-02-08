import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { Column } from "./components/Column";
import { CostSummary } from "./components/CostSummary";
import { ExportImport } from "./components/ExportImport";
import { SearchBar } from "./components/SearchBar";
import { ToolCard } from "./components/ToolCard";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ColumnType, Tool } from "./types";

const emptyState: Record<ColumnType, Tool[]> = { free: [], paid: [] };

const logoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;

const App = () => {
  const [columns, setColumns] = useLocalStorage<Record<ColumnType, Tool[]>>(
    "my-stack-tools",
    emptyState
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const activeTool = useMemo(() => {
    if (!activeId) return null;
    return [...columns.free, ...columns.paid].find((tool) => tool.id === activeId);
  }, [activeId, columns]);

  const findContainer = (id: string) => {
    if (id === "free" || id === "paid") {
      return id;
    }
    if (columns.free.some((tool) => tool.id === id)) {
      return "free";
    }
    if (columns.paid.some((tool) => tool.id === id)) {
      return "paid";
    }
    return null;
  };

  const handleAdd = (tool: { name: string; domain: string }, column: ColumnType) => {
    const newTool: Tool = {
      id: crypto.randomUUID(),
      name: tool.name,
      domain: tool.domain,
      column,
      cost: column === "paid" ? 0 : 0,
    };

    setColumns((prev) => ({
      ...prev,
      [column]: [newTool, ...prev[column]],
    }));
  };

  const handleRemove = (id: string) => {
    setColumns((prev) => ({
      free: prev.free.filter((tool) => tool.id !== id),
      paid: prev.paid.filter((tool) => tool.id !== id),
    }));
  };

  const handleCostChange = (id: string, cost: number) => {
    setColumns((prev) => ({
      ...prev,
      paid: prev.paid.map((tool) =>
        tool.id === id ? { ...tool, cost } : tool
      ),
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const items = columns[activeContainer];
      const oldIndex = items.findIndex((tool) => tool.id === active.id);
      const newIndex = items.findIndex((tool) => tool.id === over.id);
      if (oldIndex !== newIndex && newIndex !== -1) {
        setColumns((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
      return;
    }

    setColumns((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex((tool) => tool.id === active.id);
      if (activeIndex === -1) return prev;
      const [moved] = activeItems.splice(activeIndex, 1);
      const overIndex = overItems.findIndex((tool) => tool.id === over.id);
      const updatedTool = {
        ...moved,
        column: overContainer,
        cost: overContainer === "paid" ? moved.cost : 0,
      };
      if (overIndex === -1) {
        overItems.push(updatedTool);
      } else {
        overItems.splice(overIndex, 0, updatedTool);
      }
      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  };

  const handleImport = (data: Record<ColumnType, Tool[]>) => {
    setColumns({
      free: data.free ?? [],
      paid: data.paid ?? [],
    });
  };

  return (
    <div className="min-h-screen bg-bg px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-text-secondary">
              Page 1 · Tool Cost Tracker
            </span>
            <h1 className="text-2xl font-semibold">My Stack</h1>
            <p className="text-sm text-text-secondary">
              Search, drag, and manage your tool stack. Costs update in real time.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchBar onAdd={handleAdd} />
            <ExportImport data={columns} onImport={handleImport} />
          </div>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Column
              column="free"
              tools={columns.free}
              onRemove={handleRemove}
              onCostChange={handleCostChange}
            />
            <div className="flex flex-col">
              <Column
                column="paid"
                tools={columns.paid}
                onRemove={handleRemove}
                onCostChange={handleCostChange}
              />
              <CostSummary tools={columns.paid} />
            </div>
          </div>
          <DragOverlay>
            {activeTool ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-panel px-3 py-3 text-sm text-white card-shadow">
                <img
                  src={logoUrl(activeTool.domain)}
                  alt={activeTool.name}
                  className="h-8 w-8 rounded-md bg-black/40"
                />
                <div className="text-[14px] font-medium">{activeTool.name}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default App;
