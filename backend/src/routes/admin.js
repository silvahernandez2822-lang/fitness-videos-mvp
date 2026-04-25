import { Router } from 'express'
import { requireAdmin } from '../middleware/authAdmin.js'
import { assignmentService } from '../services/assignmentService.js'

const router = Router()

// Todos los endpoints requieren autenticación de admin
router.use(requireAdmin)

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await assignmentService.getUsers()
    res.json({ users })
  } catch (err) {
    console.error('[GET /users]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await assignmentService.getVideos()
    res.json({ videos })
  } catch (err) {
    console.error('[GET /videos]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/users/:userId/assignments
router.get('/users/:userId/assignments', async (req, res) => {
  try {
    const assignments = await assignmentService.getUserAssignments(req.params.userId)
    res.json({ assignments })
  } catch (err) {
    console.error('[GET assignments]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/users/:userId/assign-video
router.post('/users/:userId/assign-video', async (req, res) => {
  const { videoId, orden } = req.body

  if (!videoId || orden === undefined || orden === null) {
    return res.status(400).json({ error: 'videoId y orden son requeridos' })
  }

  const ordenNum = Number(orden)
  if (!Number.isInteger(ordenNum) || ordenNum < 1) {
    return res.status(400).json({ error: 'orden debe ser un entero mayor a 0' })
  }

  try {
    const result = await assignmentService.assignVideo(req.params.userId, videoId, ordenNum)
    res.status(201).json({
      success: true,
      assignmentId: result.id,
      message: 'Video asignado exitosamente'
    })
  } catch (err) {
    console.error('[POST assign-video]', err.message)
    const status = err.message.includes('no encontrado') ? 404 : 400
    res.status(status).json({ error: err.message })
  }
})

// DELETE /api/admin/assignments/:assignmentId
router.delete('/assignments/:assignmentId', async (req, res) => {
  try {
    const result = await assignmentService.deleteAssignment(req.params.assignmentId)
    res.json({
      success: true,
      ...result,
      message: `Asignación eliminada. ${result.reordered} asignacion(es) reordenada(s).`
    })
  } catch (err) {
    console.error('[DELETE assignment]', err.message)
    const status = err.message.includes('no encontrada') ? 404 : 500
    res.status(status).json({ error: err.message })
  }
})

export default router
