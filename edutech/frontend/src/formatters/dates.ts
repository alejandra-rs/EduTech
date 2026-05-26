export function formatDate(raw: Date | string | null | undefined): string | null {
  if (!raw) return null;
  const d = raw instanceof Date ? raw : new Date(raw);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}
