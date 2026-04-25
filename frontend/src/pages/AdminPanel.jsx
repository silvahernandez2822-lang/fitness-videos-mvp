import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { auth, db } from '../config/firebase'
import {
  collection,
  getDocs,
  query,
  addDoc,
  orderBy
} from 'firebase/firestore'

const API_BASE = 'http://localhost:5000/api/admin'

async function apiCall(method, endpoint, body = null) {
  const token = await auth.currentUser?.getIdToken(true)
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${API_BASE}${endpoint}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en el servidor')
  return data
}

export default function AdminPanel() {
  const { user, isAdmin, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [tab, setTab] = useState('usuarios')

  // ── Tab: Usuarios ────────────────────────────────────────────────
  const [usuarios, setUsuarios] = useState([])
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)

  // ── Tab: Videos ──────────────────────────────────────────────────
  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [newVideoName, setNewVideoName] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoDuracion, setNewVideoDuracion] = useState('')
  const [addingVideo, setAddingVideo] = useState(false)

  // ── Tab: Asignar ─────────────────────────────────────────────────
  const [aUsers, setAUsers] = useState([])
  const [aVideos, setAVideos] = useState([])
  const [aSelectedUser, setASelectedUser] = useState(null)
  const [aAssignments, setAAssignments] = useState([])
  const [aSelectedVideoId, setASelectedVideoId] = useState('')
  const [aOrden, setAOrden] = useState('')
  const [aLoadingUsers, setALoadingUsers] = useState(false)
  const [aLoadingVideos, setALoadingVideos] = useState(false)
  const [aLoadingAssign, setALoadingAssign] = useState(false)
  const [aAssigning, setAAssigning] = useState(false)
  const [aMessage, setAMessage] = useState(null) // { type: 'success'|'error', text }

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return }
    if (tab === 'usuarios') fetchUsuarios()
    if (tab === 'videos') fetchVideos()
    if (tab === 'asignar') { loadAUsers(); loadAVideos() }
  }, [tab, isAdmin])

  // ── Usuarios tab ─────────────────────────────────────────────────
  const fetchUsuarios = async () => {
    setLoadingUsuarios(true)
    try {
      const snap = await getDocs(query(collection(db, 'usuarios')))
      setUsuarios(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error('Error usuarios:', e)
    } finally {
      setLoadingUsuarios(false)
    }
  }

  // ── Videos tab ───────────────────────────────────────────────────
  const fetchVideos = async () => {
    setLoadingVideos(true)
    try {
      const snap = await getDocs(query(collection(db, 'videos'), orderBy('fechaCreacion', 'desc')))
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error('Error videos:', e)
    } finally {
      setLoadingVideos(false)
    }
  }

  const agregarVideo = async () => {
    if (!newVideoName || !newVideoUrl || !newVideoDuracion) {
      alert('Completa todos los campos')
      return
    }
    setAddingVideo(true)
    try {
      await addDoc(collection(db, 'videos'), {
        nombre: newVideoName,
        linkYoutube: newVideoUrl,
        duracion: parseInt(newVideoDuracion),
        fechaCreacion: new Date()
      })
      setNewVideoName(''); setNewVideoUrl(''); setNewVideoDuracion('')
      alert('Video agregado exitosamente')
      await fetchVideos()
    } catch (e) {
      alert('Error al agregar video')
    } finally {
      setAddingVideo(false)
    }
  }

  // ── Asignar tab ──────────────────────────────────────────────────
  const loadAUsers = async () => {
    setALoadingUsers(true)
    try {
      const data = await apiCall('GET', '/users')
      setAUsers(data.users || [])
    } catch (e) {
      setAMessage({ type: 'error', text: `Error cargando usuarios: ${e.message}` })
    } finally {
      setALoadingUsers(false)
    }
  }

  const loadAVideos = async () => {
    setALoadingVideos(true)
    try {
      const data = await apiCall('GET', '/videos')
      setAVideos(data.videos || [])
    } catch (e) {
      setAMessage({ type: 'error', text: `Error cargando videos: ${e.message}` })
    } finally {
      setALoadingVideos(false)
    }
  }

  const loadAAssignments = async (userId) => {
    setALoadingAssign(true)
    try {
      const data = await apiCall('GET', `/users/${userId}/assignments`)
      setAAssignments(data.assignments || [])
    } catch (e) {
      setAMessage({ type: 'error', text: `Error cargando asignaciones: ${e.message}` })
    } finally {
      setALoadingAssign(false)
    }
  }

  const handleSelectUser = (u) => {
    setASelectedUser(u)
    setAMessage(null)
    setASelectedVideoId('')
    setAOrden('')
    loadAAssignments(u.uid)
  }

  const handleAssign = async () => {
    if (!aSelectedUser) return setAMessage({ type: 'error', text: 'Selecciona un usuario' })
    if (!aSelectedVideoId) return setAMessage({ type: 'error', text: 'Selecciona un video' })
    if (!aOrden || parseInt(aOrden) < 1) return setAMessage({ type: 'error', text: 'El orden debe ser un número mayor a 0' })

    setAAssigning(true)
    setAMessage(null)
    try {
      await apiCall('POST', `/users/${aSelectedUser.uid}/assign-video`, {
        videoId: aSelectedVideoId,
        orden: parseInt(aOrden)
      })
      setAMessage({ type: 'success', text: 'Video asignado correctamente' })
      setASelectedVideoId('')
      setAOrden('')
      await loadAAssignments(aSelectedUser.uid)
    } catch (e) {
      setAMessage({ type: 'error', text: e.message })
    } finally {
      setAAssigning(false)
    }
  }

  const handleDelete = async (assignmentId) => {
    if (!window.confirm('¿Eliminar esta asignación? Los demás videos se reordenarán automáticamente.')) return
    setAMessage(null)
    try {
      const data = await apiCall('DELETE', `/assignments/${assignmentId}`)
      setAMessage({ type: 'success', text: data.message })
      await loadAAssignments(aSelectedUser.uid)
    } catch (e) {
      setAMessage({ type: 'error', text: e.message })
    }
  }

  const getVideoName = (videoId) => aVideos.find(v => v.id === videoId)?.nombre || videoId

  const handleLogout = async () => { await logout(); navigate('/login') }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">🔧 Panel Admin</h1>
              <span className="hidden sm:block text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                {user?.email}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-bold transition"
              >
                Dashboard
              </button>
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

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex">
            {[
              { key: 'usuarios', label: '👥 Usuarios' },
              { key: 'videos', label: '🎬 Videos' },
              { key: 'asignar', label: '✅ Asignar' }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-4 px-4 sm:px-6 font-bold border-b-2 transition text-sm sm:text-base ${
                  tab === t.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">

        {/* ── TAB: USUARIOS ── */}
        {tab === 'usuarios' && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Gestionar Usuarios</h2>
            {loadingUsuarios ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : usuarios.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No hay usuarios registrados aún</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usuarios.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-800">{u.nombre}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{u.email}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => { setTab('asignar') }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold transition"
                          >
                            Asignar videos
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: VIDEOS ── */}
        {tab === 'videos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Agregar Nuevo Video</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre del ejercicio"
                  value={newVideoName}
                  onChange={e => setNewVideoName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Link de YouTube (youtu.be/xxx o youtube.com/watch?v=xxx)"
                  value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Duración en minutos"
                  value={newVideoDuracion}
                  onChange={e => setNewVideoDuracion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={agregarVideo}
                  disabled={addingVideo}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {addingVideo ? 'Agregando...' : 'Agregar Video'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Videos Disponibles</h2>
              {loadingVideos ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : videos.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No hay videos aún</p>
              ) : (
                <div className="space-y-3">
                  {videos.map(v => (
                    <div key={v.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-bold text-gray-800">{v.nombre}</h3>
                      <p className="text-sm text-gray-600 mt-1">⏱️ {v.duracion} minutos</p>
                      <p className="text-xs text-gray-500 mt-2 break-all">{v.linkYoutube}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: ASIGNAR ── */}
        {tab === 'asignar' && (
          <div>
            {/* Mensaje global */}
            {aMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                aMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {aMessage.type === 'success' ? '✓ ' : '✗ '}{aMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* COLUMNA 1: USUARIOS */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-800 text-white px-4 py-3">
                  <h3 className="font-bold text-sm uppercase tracking-wide">👥 Usuarios</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Selecciona para gestionar</p>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
                  {aLoadingUsers ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                    </div>
                  ) : aUsers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      <p>No hay usuarios.</p>
                      <p className="mt-1 text-xs">¿Backend corriendo?</p>
                    </div>
                  ) : (
                    aUsers.map(u => {
                      const userAssignCount = aSelectedUser?.uid === u.uid ? aAssignments.length : null
                      const isSelected = aSelectedUser?.uid === u.uid
                      return (
                        <button
                          key={u.uid}
                          onClick={() => handleSelectUser(u)}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 transition ${
                            isSelected
                              ? 'bg-blue-50 border-l-4 border-l-blue-500'
                              : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                          }`}
                        >
                          <p className={`font-bold text-sm truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                            {u.nombre}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                          {isSelected && (
                            <p className="text-xs text-blue-600 mt-0.5 font-medium">
                              {aLoadingAssign ? 'Cargando...' : `${aAssignments.length} video(s) asignado(s)`}
                            </p>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              {/* COLUMNA 2: VIDEOS DISPONIBLES */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-800 text-white px-4 py-3">
                  <h3 className="font-bold text-sm uppercase tracking-wide">🎬 Videos Disponibles</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Asignar a usuario seleccionado</p>
                </div>

                {/* Form de asignación */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  {!aSelectedUser ? (
                    <p className="text-xs text-gray-500 text-center py-2">← Selecciona un usuario primero</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-700">
                        Asignando a: <span className="text-blue-600">{aSelectedUser.nombre}</span>
                      </p>
                      <select
                        value={aSelectedVideoId}
                        onChange={e => setASelectedVideoId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">-- Selecciona un video --</option>
                        {aVideos.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.nombre} ({v.duracion} min)
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Orden (ej: 3)"
                          value={aOrden}
                          onChange={e => setAOrden(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAssign}
                          disabled={aAssigning || !aSelectedVideoId || !aOrden}
                          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap"
                        >
                          {aAssigning ? '...' : '+ Asignar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lista de videos */}
                <div className="overflow-y-auto" style={{ maxHeight: '360px' }}>
                  {aLoadingVideos ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                    </div>
                  ) : aVideos.length === 0 ? (
                    <p className="p-4 text-center text-gray-500 text-sm">No hay videos disponibles</p>
                  ) : (
                    aVideos.map(v => (
                      <div
                        key={v.id}
                        onClick={() => aSelectedUser && setASelectedVideoId(v.id)}
                        className={`px-4 py-3 border-b border-gray-100 transition ${
                          aSelectedUser ? 'cursor-pointer hover:bg-blue-50' : ''
                        } ${aSelectedVideoId === v.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                      >
                        <p className="font-medium text-sm text-gray-800">{v.nombre}</p>
                        <p className="text-xs text-gray-500">⏱️ {v.duracion} min</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* COLUMNA 3: ASIGNACIONES ACTUALES */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-800 text-white px-4 py-3">
                  <h3 className="font-bold text-sm uppercase tracking-wide">📋 Asignaciones Actuales</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {aSelectedUser ? aSelectedUser.nombre : 'Selecciona un usuario'}
                  </p>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
                  {!aSelectedUser ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      <p className="text-2xl mb-2">👈</p>
                      <p>Selecciona un usuario para ver sus asignaciones</p>
                    </div>
                  ) : aLoadingAssign ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                    </div>
                  ) : aAssignments.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      <p className="text-2xl mb-2">📭</p>
                      <p>Sin videos asignados</p>
                    </div>
                  ) : (
                    aAssignments.map(a => (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 group"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {a.orden}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {getVideoName(a.videoId)}
                          </p>
                          {a.asignadoEn && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(a.asignadoEn).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white p-1.5 rounded transition text-xs font-bold"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
