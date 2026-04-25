const { onRequest } = require('firebase-functions/v2/https')
const cors = require('cors')({ origin: true })
const { requireAdmin } = require('../middleware/authAdmin')
const { assignmentService } = require('../services/assignmentService')

exports.deleteAssignment = onRequest(
  { region: 'us-central1', memory: '256MiB', timeoutSeconds: 60 },
  (req, res) => {
    cors(req, res, async () => {
      const adminUser = await requireAdmin(req, res)
      if (!adminUser) return
      const { assignmentId } = req.query
      if (!assignmentId) {
        return res.status(400).json({ error: 'assignmentId es requerido como query param' })
      }
      try {
        const result = await assignmentService.deleteAssignment(assignmentId)
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
    })
  }
)
