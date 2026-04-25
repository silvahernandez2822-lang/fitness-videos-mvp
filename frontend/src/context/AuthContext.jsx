import React, { createContext, useState, useEffect } from 'react'
import { auth } from '../config/firebase'
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const adminEmail = 'silvahernandez2822@gmail.com'
        const emailMatch = currentUser.email === adminEmail
        console.log('[Admin Debug] email del usuario:', currentUser.email)
        console.log('[Admin Debug] email esperado:', adminEmail)
        console.log('[Admin Debug] ¿es admin?:', emailMatch)
        setIsAdmin(emailMatch)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setIsAdmin(false)
    } catch (error) {
      console.error('Error logout:', error)
    }
  }

  const registerWithEmail = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    // Forzar refresco del objeto user para que displayName quede disponible de inmediato
    setUser({ ...result.user, displayName: name })
    return result.user
  }

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      logout,
      registerWithEmail,
      loginWithEmail,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  )
}
