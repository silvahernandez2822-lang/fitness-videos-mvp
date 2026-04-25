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
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'silvahernandez2822@gmail.com'
        setIsAdmin(!!adminEmail && currentUser.email === adminEmail)
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
    setUser({ ...result.user, displayName: name })
    return result.user
  }

  const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
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
