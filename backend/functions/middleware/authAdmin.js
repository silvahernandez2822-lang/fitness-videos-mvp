const { auth } = require('../config/firebaseAdmin')
const { isAdmin } = require('../config/admins')

async function requireAdmin(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Se requiere token de autenticación' })
    return null
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = await auth.verifyIdToken(token)
    if (!isAdmin(decoded.email)) {
      res.status(403).json({
        error: 'Acceso denegado',
        detail: `${decoded.email} no tiene permisos de administrador`
      })
      return null
    }
    return decoded
  } catch (err) {
    console.error('[Auth Error]', err.message)
    res.status(401).json({ error: 'Token inválido o expirado' })
    return null
  }
}

module.exports = { requireAdmin }
