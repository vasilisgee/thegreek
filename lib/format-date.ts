export function formatShortDate(dateString: string | null) {
  if (!dateString) return "—";

  const d = new Date(dateString);

  const day = d.getDate();               // no leading zero
  const month = d.getMonth() + 1;        // no leading zero
  const year = d.getFullYear();

  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day}/${month}/${year} · ${time}`;
}
