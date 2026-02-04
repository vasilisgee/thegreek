export function formatShortDate(dateString: string | null) {
  if (!dateString) return "—";

  const d = new Date(dateString);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day}/${month}/${year} · ${time}`;
}
