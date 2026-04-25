const admin = require('firebase-admin')

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!privateKey) throw new Error('FIREBASE_PRIVATE_KEY no está configurado en las variables de entorno de Vercel')

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    })
  })
}

module.exports = {
  db: admin.firestore(),
  auth: admin.auth(),
}
