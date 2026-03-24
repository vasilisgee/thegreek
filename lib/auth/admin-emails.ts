const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedAdminEmail(email?: string | null) {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
