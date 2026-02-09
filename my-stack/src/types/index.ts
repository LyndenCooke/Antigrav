export type ColumnType = "free" | "paid";

export type Tool = {
  id: string;
  name: string;
  domain: string;
  column: ColumnType;
  cost: number;
};

export type ToolMapping = {
  name: string;
  domain: string;
};
