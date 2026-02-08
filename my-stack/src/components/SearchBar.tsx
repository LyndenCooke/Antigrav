import { useMemo, useState } from "react";
import { toolMappings } from "../data/toolMappings";
import { ColumnType, ToolMapping } from "../types";

const logoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;

type SearchBarProps = {
  onAdd: (tool: { name: string; domain: string }, column: ColumnType) => void;
};

const normalize = (value: string) => value.toLowerCase().trim();

export const SearchBar = ({ onAdd }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const suggestions = useMemo(() => {
    if (!query.trim()) {
      return [] as ToolMapping[];
    }
    const lowered = normalize(query);
    return toolMappings
      .filter((tool) => tool.name.toLowerCase().includes(lowered))
      .slice(0, 6);
  }, [query]);

  const hasExactMatch = suggestions.some(
    (tool) => normalize(tool.name) === normalize(query)
  );

  const showCustom = query.trim().length > 0 && !hasExactMatch;

  const handleAdd = (name: string, domain: string, column: ColumnType) => {
    onAdd({ name, domain }, column);
    setQuery("");
    setCustomDomain("");
  };

  return (
    <div className="glass rounded-xl p-4 shadow-soft">
      <div className="flex flex-col gap-3">
        <label className="text-sm uppercase tracking-[0.2em] text-text-secondary">
          Tool Search
        </label>
        <input
          className="w-full rounded-lg border border-border bg-panel px-4 py-3 text-[16px] text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="Search a tool or type a new one..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {(suggestions.length > 0 || showCustom) && (
        <div className="mt-4 space-y-2">
          {suggestions.map((tool) => (
            <div
              key={tool.name}
              className="flex flex-col gap-2 rounded-lg border border-border bg-panel px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={logoUrl(tool.domain)}
                  alt={`${tool.name} logo`}
                  className="h-8 w-8 rounded-md bg-black/40"
                />
                <div className="text-sm font-medium text-white">
                  {tool.name}
                </div>
                <span className="ml-auto text-xs text-text-secondary">
                  {tool.domain}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-md border border-free/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-free hover:bg-free/10"
                  onClick={() => handleAdd(tool.name, tool.domain, "free")}
                >
                  Add Free
                </button>
                <button
                  className="rounded-md border border-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent hover:bg-accent/10"
                  onClick={() => handleAdd(tool.name, tool.domain, "paid")}
                >
                  Add Paid
                </button>
              </div>
            </div>
          ))}
          {showCustom && (
            <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-panel px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/40 text-xs text-text-secondary">
                  ?
                </div>
                <div className="text-sm font-medium text-white">
                  {query}
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  className="flex-1 rounded-md border border-border bg-[#101010] px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  placeholder="example.com"
                  value={customDomain}
                  onChange={(event) => setCustomDomain(event.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="rounded-md border border-free/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-free hover:bg-free/10"
                    onClick={() =>
                      handleAdd(query, customDomain.trim(), "free")
                    }
                    disabled={!customDomain.includes(".")}
                  >
                    Add Free
                  </button>
                  <button
                    className="rounded-md border border-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent hover:bg-accent/10"
                    onClick={() =>
                      handleAdd(query, customDomain.trim(), "paid")
                    }
                    disabled={!customDomain.includes(".")}
                  >
                    Add Paid
                  </button>
                </div>
              </div>
              {customDomain && customDomain.includes(".") && (
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <img
                    src={logoUrl(customDomain.trim())}
                    alt="Custom logo"
                    className="h-5 w-5 rounded bg-black/40"
                  />
                  Preview from Clearbit
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
