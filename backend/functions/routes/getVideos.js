const { onRequest } = require('firebase-functions/v2/https')
const cors = require('cors')({ origin: true })
const { requireAdmin } = require('../middleware/authAdmin')
const { assignmentService } = require('../services/assignmentService')

exports.getVideos = onRequest(
  { region: 'us-central1', memory: '256MiB', timeoutSeconds: 60 },
  (req, res) => {
    cors(req, res, async () => {
      const adminUser = await requireAdmin(req, res)
      if (!adminUser) return
      try {
        const videos = await assignmentService.getVideos()
        res.json({ videos })
      } catch (err) {
        console.error('[getVideos]', err.message)
        res.status(500).json({ error: err.message })
      }
    })
  }
)
