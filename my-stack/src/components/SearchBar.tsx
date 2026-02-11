import { useMemo, useState } from "react";
import { toolMappings } from "../data/toolMappings";
import { ColumnType, ToolMapping } from "../types";

const logoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;

const normalize = (value: string) => value.toLowerCase().trim();

type SearchBarProps = {
  onAdd: (tool: { name: string; domain: string }, column: ColumnType) => void;
};

const EmptyLogo = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/40 text-xs text-text-secondary">
    ?
  </div>
);

const SuggestionRow = ({
  name,
  domain,
  onAdd,
}: {
  name: string;
  domain?: string;
  onAdd: (column: ColumnType) => void;
}) => (
  <div className="animate-fadeIn flex flex-col gap-2 rounded-lg border border-border bg-panel px-3 py-3">
    <div className="flex items-center gap-3">
      {domain ? (
        <img
          src={logoUrl(domain)}
          alt={`${name} logo`}
          className="h-8 w-8 rounded-md bg-black/40"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <EmptyLogo />
      )}
      <div className="text-sm font-medium text-white">{name}</div>
      <span className="ml-auto text-xs text-text-secondary">{domain ?? "Add domain"}</span>
    </div>
    <div className="flex gap-2">
      <button
        className="rounded-md border border-free/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-free hover:bg-free/10"
        onClick={() => onAdd("free")}
        disabled={!domain}
      >
        Add Free
      </button>
      <button
        className="rounded-md border border-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent hover:bg-accent/10"
        onClick={() => onAdd("paid")}
        disabled={!domain}
      >
        Add Paid
      </button>
    </div>
  </div>
);

export const SearchBar = ({ onAdd }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const loweredQuery = normalize(query);

  const exactMapping = useMemo(
    () => toolMappings.find((tool) => normalize(tool.name) === loweredQuery),
    [loweredQuery]
  );

  const suggestions = useMemo(() => {
    if (!loweredQuery) {
      return [] as ToolMapping[];
    }

    return toolMappings
      .filter((tool) => tool.name.toLowerCase().includes(loweredQuery))
      .slice(0, 6);
  }, [loweredQuery]);

  const handleAdd = (name: string, domain: string, column: ColumnType) => {
    onAdd({ name: name.trim(), domain: domain.trim() }, column);
    setQuery("");
    setCustomDomain("");
  };

  const showResults = query.trim().length > 0;

  return (
    <div className="glass rounded-xl p-4 shadow-soft">
      <div className="flex flex-col gap-3">
        <label className="text-xs uppercase tracking-[0.3em] text-text-secondary">Tool Search</label>
        <input
          className="w-full rounded-lg border border-border bg-panel px-4 py-3 text-[16px] text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="Search a tool or type a new one..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {showResults && (
        <div className="mt-4 space-y-2">
          <SuggestionRow
            name={query.trim()}
            domain={exactMapping?.domain}
            onAdd={(column) => {
              if (exactMapping) {
                handleAdd(query, exactMapping.domain, column);
              }
            }}
          />

          {suggestions
            .filter((tool) => normalize(tool.name) !== loweredQuery)
            .map((tool) => (
              <SuggestionRow
                key={tool.name}
                name={tool.name}
                domain={tool.domain}
                onAdd={(column) => handleAdd(tool.name, tool.domain, column)}
              />
            ))}

          {!exactMapping && (
            <div className="animate-fadeIn rounded-lg border border-dashed border-border bg-panel px-3 py-3">
              <div className="mb-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Custom domain</div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  className="flex-1 rounded-md border border-border bg-[#101010] px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  placeholder="example.com"
                  value={customDomain}
                  onChange={(event) => setCustomDomain(event.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="rounded-md border border-free/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-free hover:bg-free/10 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleAdd(query, customDomain, "free")}
                    disabled={!customDomain.includes(".")}
                  >
                    Add Free
                  </button>
                  <button
                    className="rounded-md border border-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleAdd(query, customDomain, "paid")}
                    disabled={!customDomain.includes(".")}
                  >
                    Add Paid
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
