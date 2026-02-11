import { useRef } from "react";
import type { ChangeEvent } from "react";
import { ColumnType, Tool } from "../types";

type ExportImportProps = {
  data: Record<ColumnType, Tool[]>;
  onImport: (data: Record<ColumnType, Tool[]>) => void;
};

const isToolArray = (value: unknown): value is Tool[] => Array.isArray(value);

export const ExportImport = ({ data, onImport }: ExportImportProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-stack.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as {
          free?: unknown;
          paid?: unknown;
        };

        if (isToolArray(parsed.free) || isToolArray(parsed.paid)) {
          onImport({
            free: isToolArray(parsed.free) ? parsed.free : [],
            paid: isToolArray(parsed.paid) ? parsed.paid : [],
          });
        }
      } catch {
        // Ignore invalid JSON payloads.
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className="rounded-md border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:border-accent hover:text-accent"
        onClick={handleExport}
      >
        Export JSON
      </button>
      <button
        className="rounded-md border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:border-accent hover:text-accent"
        onClick={() => inputRef.current?.click()}
      >
        Import JSON
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
};
