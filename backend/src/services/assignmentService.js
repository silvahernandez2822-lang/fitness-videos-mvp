import { db, auth } from '../config/firebaseAdmin.js'

function serializeTimestamp(ts) {
  if (!ts) return null
  if (typeof ts.toDate === 'function') return ts.toDate().toISOString()
  if (ts instanceof Date) return ts.toISOString()
  return null
}

export const assignmentService = {
  async getUsers() {
    const result = await auth.listUsers(1000)
    return result.users.map(u => ({
      uid: u.uid,
      email: u.email || '',
      nombre: u.displayName || u.email?.split('@')[0] || 'Sin nombre',
      fechaRegistro: u.metadata.creationTime,
    }))
  },

  async getVideos() {
    try {
      const snap = await db.collection('videos').orderBy('fechaCreacion', 'desc').get()
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      // Fallback si algún video no tiene fechaCreacion
      if (err.code === 'failed-precondition' || err.message?.includes('index')) {
        const snap = await db.collection('videos').get()
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }
      throw err
    }
  },

  async getUserAssignments(userId) {
    try {
      const snap = await db.collection('asignaciones')
        .where('usuarioId', '==', userId)
        .orderBy('orden', 'asc')
        .get()

      return snap.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          usuarioId: data.usuarioId,
          videoId: data.videoId,
          orden: data.orden,
          estado: data.estado || 'activo',
          asignadoEn: serializeTimestamp(data.asignadoEn),
        }
      })
    } catch (err) {
      // Error 9 = FAILED_PRECONDITION = índice faltante
      if (err.code === 9 || err.message?.includes('index')) {
        const msg =
          'Falta el índice compuesto en Firestore. ' +
          'Ejecuta: npx firebase-tools deploy --only firestore:indexes ' +
          '(requiere firebase.json y firestore.indexes.json en la raíz del proyecto). ' +
          `Error original: ${err.message}`
        throw new Error(msg)
      }
      throw err
    }
  },

  async assignVideo(userId, videoId, orden) {
    // Verificar usuario existe en Firebase Auth
    try {
      await auth.getUser(userId)
    } catch {
      throw new Error(`Usuario con ID '${userId}' no encontrado en Firebase Auth`)
    }

    // Verificar video existe
    const videoDoc = await db.collection('videos').doc(videoId).get()
    if (!videoDoc.exists) {
      throw new Error(`Video '${videoId}' no encontrado`)
    }

    // Verificar que el slot de orden no está ocupado para este usuario
    const orderTaken = await db.collection('asignaciones')
      .where('usuarioId', '==', userId)
      .where('orden', '==', orden)
      .get()

    if (!orderTaken.empty) {
      throw new Error(`La posición ${orden} ya está ocupada. Elige otro número.`)
    }

    const docRef = await db.collection('asignaciones').add({
      usuarioId: userId,
      videoId,
      orden,
      asignadoEn: new Date(),
      estado: 'activo',
    })

    return { id: docRef.id }
  },

  async deleteAssignment(assignmentId) {
    const assignDoc = await db.collection('asignaciones').doc(assignmentId).get()
    if (!assignDoc.exists) {
      throw new Error('Asignación no encontrada')
    }

    const { usuarioId, orden } = assignDoc.data()

    await db.collection('asignaciones').doc(assignmentId).delete()

    // Reordenar: decrementar orden de asignaciones con orden > eliminado
    const higher = await db.collection('asignaciones')
      .where('usuarioId', '==', usuarioId)
      .where('orden', '>', orden)
      .get()

    if (!higher.empty) {
      const batch = db.batch()
      higher.docs.forEach(doc => {
        batch.update(doc.ref, { orden: doc.data().orden - 1 })
      })
      await batch.commit()
    }

    return { deletedId: assignmentId, reordered: higher.size }
  }
}
