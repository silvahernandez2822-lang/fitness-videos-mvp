const { handleCors } = require('./_lib/cors')
const { requireAdmin } = require('./_lib/authAdmin')
const { assignmentService } = require('./_lib/assignmentService')

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const adminUser = await requireAdmin(req, res)
  if (!adminUser) return

  const { userId } = req.query
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({ error: 'userId es requerido como query param' })
  }

  try {
    const assignments = await assignmentService.getUserAssignments(userId.trim())
    res.json({ assignments })
  } catch (err) {
    console.error('[getUserAssignments]', err.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
