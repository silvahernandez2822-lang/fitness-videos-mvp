import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import adminRoutes from './routes/admin.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'Backend running', env: process.env.NODE_ENV })
})

app.use('/api/admin', adminRoutes)

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
})
