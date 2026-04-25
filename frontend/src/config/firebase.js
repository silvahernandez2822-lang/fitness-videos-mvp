import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// IMPORTANTE: Reemplaza esto con tus credenciales de Firebase
// Ve a: https://console.firebase.google.com
// Proyecto → Configuración → Configuración del proyecto → Tus aplicaciones
const firebaseConfig = {
  apiKey: "AIzaSyCNrQ37YfeNoCuLg1IMiQssZ9AbrRLQgXY",
  authDomain: "mvp-fitness-b33ff.firebaseapp.com",
  projectId: "mvp-fitness-b33ff",
  storageBucket: "mvp-fitness-b33ff.firebasestorage.app",
  messagingSenderId: "386551677441",
  appId: "1:386551677441:web:c8e7090e5d4174ec3db600",
  measurementId: "G-HPTEHQ20YW"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
