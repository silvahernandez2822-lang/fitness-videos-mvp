import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { db } from '../config/firebase'
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore'
import VideoPlayer from '../components/VideoPlayer'

export default function Dashboard() {
  const { user, isAdmin, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [indexError, setIndexError] = useState(false)

  useEffect(() => {
    fetchUserVideos()
  }, [user])

  const fetchUserVideos = async () => {
    if (!user) return

    try {
      const assignmentsQuery = query(
        collection(db, 'asignaciones'),
        where('usuarioId', '==', user.uid),
        orderBy('orden', 'asc')
      )
      const assignmentsSnap = await getDocs(assignmentsQuery)
      const assignments = assignmentsSnap.docs.map(d => ({ docId: d.id, ...d.data() }))

      // Obtener videos únicos en paralelo (sin N+1)
      const uniqueVideoIds = [...new Set(assignments.map(a => a.videoId))]
      const videoMap = {}
      await Promise.all(
        uniqueVideoIds.map(async (videoId) => {
          const videoDoc = await getDoc(doc(db, 'videos', videoId))
          if (videoDoc.exists()) {
            videoMap[videoId] = { id: videoDoc.id, ...videoDoc.data() }
          }
        })
      )

      const videosData = assignments
        .filter(a => videoMap[a.videoId])
        .map(a => ({ orden: a.orden, ...videoMap[a.videoId] }))

      setVideos(videosData)
    } catch (error) {
      console.error('Error fetching videos:', error)
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        setIndexError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Cargando tu rutina...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">💪 Mi Rutina</h1>
              <p className="text-sm text-gray-600 mt-1">Hola, {user.displayName || 'Usuario'}</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                >
                  Panel Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {indexError && (
          <div className="mb-4 bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg text-sm">
            <strong>Configuración pendiente:</strong> Falta crear el índice de Firestore.
            Consulta el archivo <code>firestore.indexes.json</code> en la raíz del proyecto.
          </div>
        )}

        {selectedVideo ? (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <button
              onClick={() => setSelectedVideo(null)}
              className="mb-4 text-blue-500 hover:text-blue-700 font-bold flex items-center gap-2"
            >
              ← Volver a la lista
            </button>
            <VideoPlayer video={selectedVideo} />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Tu Rutina de Esta Semana</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {videos.length === 0 ? 'No hay videos asignados aún' : `${videos.length} ejercicios para completar`}
                </p>
              </div>

              {videos.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600 text-lg">Aún no hay videos asignados en tu rutina.</p>
                  <p className="text-gray-500 text-sm mt-2">Tu entrenador los agregará pronto.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {videos.map((video, index) => (
                    <div
                      key={`${video.id}-${video.orden}`}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 truncate">{video.nombre}</h3>
                          <p className="text-sm text-gray-600 mt-1">⏱️ {video.duracion} minutos</p>
                        </div>
                        <div className="flex-shrink-0 text-blue-500 text-xl">▶️</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {videos.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <h3 className="font-bold text-blue-900 mb-2">💡 Consejos:</h3>
                <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                  <li>Sigue el orden de los ejercicios</li>
                  <li>Descansa entre ejercicios si es necesario</li>
                  <li>Mantén buena forma en cada movimiento</li>
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
