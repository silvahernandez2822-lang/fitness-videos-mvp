const { onRequest } = require('firebase-functions/v2/https')
const cors = require('cors')({ origin: true })
const { requireAdmin } = require('../middleware/authAdmin')
const { assignmentService } = require('../services/assignmentService')

exports.getUserAssignments = onRequest(
  { region: 'us-central1', memory: '256MiB', timeoutSeconds: 60 },
  (req, res) => {
    cors(req, res, async () => {
      const adminUser = await requireAdmin(req, res)
      if (!adminUser) return
      const { userId } = req.query
      if (!userId) {
        return res.status(400).json({ error: 'userId es requerido como query param' })
      }
      try {
        const assignments = await assignmentService.getUserAssignments(userId)
        res.json({ assignments })
      } catch (err) {
        console.error('[getUserAssignments]', err.message)
        res.status(500).json({ error: err.message })
      }
    })
  }
)
