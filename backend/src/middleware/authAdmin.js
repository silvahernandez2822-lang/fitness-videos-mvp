import { auth } from '../config/firebaseAdmin.js'
import { isAdmin } from '../../config/admins.js'

export async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Se requiere token de autenticación' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = await auth.verifyIdToken(token)

    if (!isAdmin(decoded.email)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        detail: `${decoded.email} no tiene permisos de administrador`
      })
    }

    req.adminUser = decoded
    next()
  } catch (err) {
    console.error('[Auth Error]', err.message)
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
