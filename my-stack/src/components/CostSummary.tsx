import { Tool } from "../types";

type CostSummaryProps = {
  tools: Tool[];
};

export const CostSummary = ({ tools }: CostSummaryProps) => {
  const monthly = tools.reduce((total, tool) => total + (tool.cost || 0), 0);
  const yearly = monthly * 12;

  return (
    <div className="sticky bottom-0 mt-4 rounded-xl border border-border bg-[#111111] px-4 py-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-text-secondary">
        <span>Total</span>
        <span className="font-mono">Paid Stack</span>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="text-sm text-text-secondary">Monthly</div>
          <div className="font-mono text-[20px] font-semibold text-white">
            <span className="text-accent">£{monthly.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-secondary">Yearly</div>
          <div className="font-mono text-[20px] font-semibold text-white">
            £{yearly.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
