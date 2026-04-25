import { auth } from './firebase'

export const FUNCTIONS = {
  getUsers:            '/api/getUsers',
  getVideos:           '/api/getVideos',
  getUserAssignments:  (userId) => `/api/getUserAssignments?userId=${encodeURIComponent(userId)}`,
  assignVideo:         '/api/assignVideo',
  deleteAssignment:    (assignmentId) => `/api/deleteAssignment?assignmentId=${encodeURIComponent(assignmentId)}`,
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
