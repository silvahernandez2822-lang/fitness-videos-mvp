const { handleCors } = require('./_lib/cors')
const { requireAdmin } = require('./_lib/authAdmin')
const { assignmentService } = require('./_lib/assignmentService')

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const adminUser = await requireAdmin(req, res)
  if (!adminUser) return

  try {
    const users = await assignmentService.getUsers()
    res.json({ users })
  } catch (err) {
    console.error('[getUsers]', err.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
