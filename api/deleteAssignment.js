const { handleCors } = require('./_lib/cors')
const { requireAdmin } = require('./_lib/authAdmin')
const { assignmentService } = require('./_lib/assignmentService')

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Método no permitido' })

  const adminUser = await requireAdmin(req, res)
  if (!adminUser) return

  const { assignmentId } = req.query
  if (!assignmentId || typeof assignmentId !== 'string' || assignmentId.trim() === '') {
    return res.status(400).json({ error: 'assignmentId es requerido como query param' })
  }

  try {
    const result = await assignmentService.deleteAssignment(assignmentId.trim())
    res.json({
      success: true,
      ...result,
      message: `Asignación eliminada. ${result.reordered} asignacion(es) reordenada(s).`
    })
  } catch (err) {
    console.error('[deleteAssignment]', err.message)
    const status = err.message.includes('no encontrada') ? 404 : 500
    res.status(status).json({ error: err.message })
  }
}
