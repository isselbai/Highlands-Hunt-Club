export function isAdminFromEmail(email?: string | null) {
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map(s => s.trim().toLowerCase())
  return !!email && admins.includes(email.toLowerCase())
}