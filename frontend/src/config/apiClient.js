import { auth } from './firebase'

const CF_BASE = 'https://us-central1-mvp-fitness-b33ff.cloudfunctions.net'

export const FUNCTIONS = {
  getUsers:            `${CF_BASE}/getUsers`,
  getVideos:           `${CF_BASE}/getVideos`,
  getUserAssignments:  (userId)       => `${CF_BASE}/getUserAssignments?userId=${userId}`,
  assignVideo:         `${CF_BASE}/assignVideo`,
  deleteAssignment:    (assignmentId) => `${CF_BASE}/deleteAssignment?assignmentId=${assignmentId}`,
}

export async function apiCall(method, url, body = null) {
  const token = await auth.currentUser?.getIdToken(true)
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en el servidor')
  return data
}
