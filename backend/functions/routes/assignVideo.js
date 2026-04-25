const { onRequest } = require('firebase-functions/v2/https')
const cors = require('cors')({ origin: true })
const { requireAdmin } = require('../middleware/authAdmin')
const { assignmentService } = require('../services/assignmentService')

exports.assignVideo = onRequest(
  { region: 'us-central1', memory: '256MiB', timeoutSeconds: 60 },
  (req, res) => {
    cors(req, res, async () => {
      const adminUser = await requireAdmin(req, res)
      if (!adminUser) return
      const { userId, videoId, orden } = req.body
      if (!userId || !videoId || orden === undefined || orden === null) {
        return res.status(400).json({ error: 'userId, videoId y orden son requeridos' })
      }
      const ordenNum = Number(orden)
      if (!Number.isInteger(ordenNum) || ordenNum < 1) {
        return res.status(400).json({ error: 'orden debe ser un entero mayor a 0' })
      }
      try {
        const result = await assignmentService.assignVideo(userId, videoId, ordenNum)
        res.status(201).json({
          success: true,
          assignmentId: result.id,
          message: 'Video asignado exitosamente'
        })
      } catch (err) {
        console.error('[assignVideo]', err.message)
        const status = err.message.includes('no encontrado') ? 404 : 400
        res.status(status).json({ error: err.message })
      }
    })
  }
)
