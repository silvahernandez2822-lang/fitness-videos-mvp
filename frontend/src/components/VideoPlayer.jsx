import React from 'react'

export default function VideoPlayer({ video }) {
  // Extraer ID de YouTube del URL
  const getYoutubeId = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const youtubeId = getYoutubeId(video.linkYoutube)

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {video.nombre}
      </h2>

      {/* Metadata */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6 flex gap-6">
        <div>
          <p className="text-sm text-gray-600">Duración</p>
          <p className="text-lg font-bold text-gray-800">⏱️ {video.duracion} min</p>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden mb-6" style={{ paddingBottom: '56.25%' }}>
        {youtubeId ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={video.nombre}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <p className="text-lg">URL de video no válido</p>
              <p className="text-sm text-gray-400 mt-2">Contacta a tu entrenador</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {video.descripcion && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-2">Descripción:</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {video.descripcion}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-bold text-green-900 mb-2">✅ Cómo hacer este ejercicio:</h3>
        <ol className="text-sm text-green-800 space-y-2 ml-4 list-decimal">
          <li>Mira el video completo</li>
          <li>Replica los movimientos con buena forma</li>
          <li>Si tienes duda, vuelve a ver la parte que no entiendes</li>
          <li>Pasa al siguiente ejercicio cuando termines</li>
        </ol>
      </div>
    </div>
  )
}
