export type Row = { date: string; value: number | null; unit: string };
export type View = { component: "line-chart" | "data-table"; reason: string; rows: Row[] };

function validDay(day: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(day) &&
    Number.isFinite(Date.parse(day)) &&
    new Date(day).toISOString().slice(0, 10) === day;
}

// The agent may suggest a chart. The application owns the final component.
export function chooseView(input: unknown): View {
  if (typeof input !== "object" || input === null || !("rows" in input))
    throw new Error("invalid-envelope");
  const rows = (input as { rows: unknown }).rows;
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 100)
    throw new Error("invalid-row-count");
  for (const row of rows) {
    if (typeof row !== "object" || row === null ||
      typeof row.date !== "string" || !validDay(row.date) ||
      typeof row.unit !== "string" || row.unit.trim().length === 0 ||
      !(row.value === null || (typeof row.value === "number" && Number.isFinite(row.value))))
      throw new Error("invalid-row");
  }
  const clean: Row[] = rows.map(row => ({date: row.date, value: row.value, unit: row.unit}));
  const table = (reason: string): View => ({component: "data-table", reason, rows: clean});
  if (clean.length < 3) return table("too-few-points");
  if (new Set(clean.map(r => r.unit)).size !== 1) return table("mixed-units");
  if (clean.some(r => r.value === null)) return table("missing-values");
  const times = clean.map(r => Date.parse(r.date));
  if (times.some((time, i) => i > 0 && time <= times[i - 1]))
    return table("not-strictly-chronological");
  const step = times[1] - times[0];
  if (times.some((time, i) => i > 1 && time - times[i - 1] !== step))
    return table("irregular-spacing");
  return {component: "line-chart", reason: "complete-regular-series", rows: clean};
}
