import dotenv from 'dotenv'
dotenv.config()

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdmin(email) {
  return adminEmails.includes((email || '').toLowerCase())
}
