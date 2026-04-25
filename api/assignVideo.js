const { handleCors } = require('./_lib/cors')
const { requireAdmin } = require('./_lib/authAdmin')
const { assignmentService } = require('./_lib/assignmentService')

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const adminUser = await requireAdmin(req, res)
  if (!adminUser) return

  const { userId, videoId, orden } = req.body || {}
  if (!userId || !videoId || orden === undefined || orden === null) {
    return res.status(400).json({ error: 'userId, videoId y orden son requeridos' })
  }
  if (typeof userId !== 'string' || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'userId y videoId deben ser strings' })
  }
  const ordenNum = Number(orden)
  if (!Number.isInteger(ordenNum) || ordenNum < 1) {
    return res.status(400).json({ error: 'orden debe ser un entero mayor a 0' })
  }

  try {
    const result = await assignmentService.assignVideo(userId.trim(), videoId.trim(), ordenNum)
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
}
