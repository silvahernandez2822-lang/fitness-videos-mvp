const { onRequest } = require('firebase-functions/v2/https')
const cors = require('cors')({ origin: true })
const { requireAdmin } = require('../middleware/authAdmin')
const { assignmentService } = require('../services/assignmentService')

exports.getUsers = onRequest(
  { region: 'us-central1', memory: '256MiB', timeoutSeconds: 60 },
  (req, res) => {
    cors(req, res, async () => {
      const adminUser = await requireAdmin(req, res)
      if (!adminUser) return
      try {
        const users = await assignmentService.getUsers()
        res.json({ users })
      } catch (err) {
        console.error('[getUsers]', err.message)
        res.status(500).json({ error: err.message })
      }
    })
  }
)
