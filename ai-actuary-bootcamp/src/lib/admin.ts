export const ADMIN_EMAILS = ["fixola1986@gmail.com", "pedro@stratfordgeek.com"];

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return ADMIN_EMAILS.includes(email);
}
