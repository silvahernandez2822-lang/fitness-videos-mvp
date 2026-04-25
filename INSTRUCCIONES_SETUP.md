# 🚀 INSTRUCCIONES SETUP - VERSIÓN ACTUALIZADA

## Estado Actual de tu Proyecto

✅ **COMPLETADO:**
- Estructura de carpetas refactorizada (frontend/ y backend/ independientes)
- Vulnerabilidades de seguridad auditadas y resueltas
- Firebase 11.0.0 (sin vulnerabilidades HIGH/CRITICAL)
- Vite 6.4.2 (sin vulnerabilidades de dev-server)
- Ambos servidores corriendo sin errores

⏳ **PRÓXIMO:** Configurar Firebase y habilitar autenticación

---

## 📋 PASOS COMPLETADOS (Para referencia)

### ✅ PASO 1: Descargar el Proyecto
- Descargaste ZIP/TAR.GZ
- Extrajiste la carpeta
- Ubicación: `C:\Users\silva\Desktop\claude_code\fitness-videos-mvp`

### ✅ PASO 2: Instalar Dependencias (Con auditoría de seguridad)
```bash
cd C:\Users\silva\Desktop\claude_code\fitness-videos-mvp
npm run install-all
```

**Cambios de seguridad aplicados automáticamente:**
- firebase: 10.7.0 → 11.0.0 (elimina undici vulnerabilidades)
- vite: 5.0.8 → 6.4.2 (elimina path traversal)
- @vitejs/plugin-react: 4.2.1 → 4.4.0 (compatible con vite 6)
- firebase-admin: 12.1.0 → 13.8.0 (última versión estable)

**Estado de seguridad:**
- Frontend: 0 vulnerabilidades ✓
- Backend: 0 HIGH/CRITICAL (8 moderate aceptables para MVP)

### ✅ PASO 3: Ejecutar en Desarrollo
Abriste 2 terminales:

**Terminal 1 (Frontend):**
```bash
cd C:\Users\silva\Desktop\claude_code\fitness-videos-mvp\frontend
npm run dev
```
Resultado: `http://localhost:3000` ✓

**Terminal 2 (Backend):**
```bash
cd C:\Users\silva\Desktop\claude_code\fitness-videos-mvp\backend
npm run dev
```
Resultado: `http://localhost:5000` ✓

---

## 📍 PASO 4: Configurar Firebase (👈 TÚ ESTÁS AQUÍ)

### 4.1: Obtener Credenciales Firebase

1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto
3. Click ⚙️ (Configuración) → **Configuración del proyecto**
4. Pestaña: **General**
5. Sección: **Tus aplicaciones**
6. Deberías ver tu app web (si no, click "Agregar app" → Web)
7. Click el ícono `</>`
8. **Copia COMPLETO el bloque firebaseConfig:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDq...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

### 4.2: Actualizar firebase.js en tu proyecto

1. Abre: `frontend/src/config/firebase.js`
2. Busca: `const firebaseConfig = { ... }`
3. Reemplaza COMPLETAMENTE con TUS credenciales de arriba
4. **Guarda** el archivo

**Ejemplo de cómo debe quedar:**
```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Tus credenciales REALES
const firebaseConfig = {
  apiKey: "AIzaSyDq1Lxyz123abc456def789ghi",
  authDomain: "mi-fitness.firebaseapp.com",
  projectId: "mi-fitness-12345",
  storageBucket: "mi-fitness-12345.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abcdef1234567890"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

### 4.3: Crear Firestore Database

1. Firebase Console → **Firestore Database**
2. Click: **"Create database"**
3. Modo: **"Start in test mode"** (para MVP/desarrollo)
4. Ubicación: Predeterminada está bien
5. Click: **"Create"**
6. **Espera 30-60 segundos** a que se cree

### 4.4: Crear las 3 Colecciones

Una vez que Firestore está listo:

**Colección 1: usuarios**
1. Click: **"Start collection"**
2. Nombre: `usuarios`
3. Click: **"Auto ID"**
4. Agregar un documento con cualquier dato (lo borramos después)
5. Click: **"Save"**

**Colección 2: videos**
1. Repite el proceso
2. Nombre: `videos`

**Colección 3: asignaciones**
1. Repite el proceso
2. Nombre: `asignaciones`

**Resultado final:** Deberías ver 3 colecciones en tu Firestore

### 4.5: Habilitar Autenticación en Firebase

1. Firebase Console → **Authentication**
2. Click: **"Get started"**
3. Método 1 - Email/Password:
   - Click: **"Email/Password"**
   - Toggle: **"Enable"**
   - Click: **"Save"**
4. Método 2 - Google:
   - Click: **"Google"**
   - Toggle: **"Enable"**
   - Configura: Email de soporte y logo (opcional para MVP)
   - Click: **"Save"**

### 4.6: Verificar que todo funciona

Abre tu navegador en: `http://localhost:3000`

Deberías ver:
- ✓ Pantalla de Login/Registro
- ✓ Campos para email y contraseña
- ✓ Botón "Continuar con Google"

**Si ves un error en lugar de esto:**
1. Abre la consola (F12)
2. Lee el error exacto
3. Pásame el error aquí

---

## 📍 PASO 5: Configurar Acceso Admin

Para acceder al panel admin con tu email:

1. Abre: `frontend/src/context/AuthContext.jsx`
2. Busca la línea (~línea 30):
```javascript
setIsAdmin(currentUser.email === 'tu-email@gmail.com')
```
3. Reemplaza `'tu-email@gmail.com'` con TU EMAIL REAL. Ejemplo:
```javascript
setIsAdmin(currentUser.email === 'juan@gmail.com')
```
4. **Guarda** el archivo

**Importante:** El frontend se recargará automáticamente. Ahora cuando inicies sesión con ese email, verás el botón "Panel Admin".

---

## 📍 PASO 6: Probar Localmente (End-to-End)

### 6.1: Registrar Usuario Normal

1. Abre: `http://localhost:3000`
2. Click: **"Regístrate"**
3. Llena:
   - Nombre: `Usuario Test`
   - Email: `usuario1@gmail.com`
   - Contraseña: `Test123456!`
4. Click: **"Registrarse"**

**Resultado esperado:**
- Dashboard vacío (sin videos asignados)
- Botón "Salir" visible
- Bienvenida: "Hola, Usuario Test"

### 6.2: Registrar como Admin (TÚ)

1. Salir de la sesión
2. Registrate CON TU EMAIL (el que configuraste en PASO 5)
3. Ejemplo:
   - Nombre: `Tu Nombre`
   - Email: `juan@gmail.com` (TU EMAIL)
   - Contraseña: `Admin123456!`
4. Click: **"Registrarse"**

**Resultado esperado:**
- Dashboard vacío
- Botón "Salir"
- **NUEVO: Link o botón "Panel Admin"** (esto solo aparece si usaste el email correcto)

### 6.3: Acceder al Admin Panel

1. Click: **"Panel Admin"**
2. Deberías ver 3 pestañas:
   - 👥 Usuarios
   - 🎬 Videos
   - ✅ Asignar

**Si ves las 3 pestañas:** ✓ TODO está funcionando

**Si NO ves el botón Admin Panel:**
- Verificas que el email en `AuthContext.jsx` es exacto
- Salir y volver a entrar
- Abrir consola (F12) para revisar errores

---

## 📍 PASO 7: Agregar Videos Pregrabados

En el **Panel Admin**, pestaña **"Videos"**:

1. Rellena:
   - Nombre: `Calentamiento - 5 minutos`
   - Link: Tu video de YouTube en formato:
     - `https://youtu.be/dQw4w9WgXcQ` (short link)
     - O: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Duración: `5`
2. Click: **"Agregar Video"**

**Nota:** Los videos deben estar en YouTube "no listados" para privacidad.

Repite para agregar 2-3 videos de prueba.

---

## 📍 PASO 8: Asignar Videos a Clientes

En el **Panel Admin**, pestaña **"Usuarios"**:

1. Verás el usuario normal que registraste (`usuario1@gmail.com`)
2. Click: **"Asignar videos"**
3. Pestaña: **"Asignar"**

**Por ahora la interfaz es básica.** Para asignar videos manualmente:

Abre Firebase Console → Firestore → Colección **"asignaciones"**:

Crea un documento con:
```
{
  usuarioId: "UID_DEL_USUARIO",
  videoId: "ID_DEL_VIDEO",
  orden: 1
}
```

(Mejoraremos esta interfaz después)

---

## 📍 PASO 9: Deploy a Vercel (Opcional para MVP)

Si quieres publicar en vivo:

### 9.1: Subir a GitHub

```bash
cd C:\Users\silva\Desktop\claude_code\fitness-videos-mvp

# Inicializar Git
git init

# Agregar archivos
git add .

# Primer commit
git commit -m "MVP Fitness Videos v1.0 - Estructura profesional con seguridad auditada"

# Crear repositorio en GitHub (desde navegador)
# Luego conectar:
git remote add origin https://github.com/TU_USUARIO/fitness-videos-mvp.git
git branch -M main
git push -u origin main
```

### 9.2: Deploy en Vercel

1. Ve a https://vercel.com
2. Click: **"New Project"**
3. Selecciona tu repositorio
4. **Configuración:**
   - Framework: **Other**
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Root Directory: `.`
5. **Variables de entorno:** (en "Environment Variables")
   - Agrega tus credenciales de Firebase
6. Click: **"Deploy"**

**Espera 3-5 minutos.**

Tu sitio estará en: `https://fitness-videos-mvp.vercel.app`

---

## ✅ Checklist Final de MVP

- [ ] ✓ Firebase conectado (sin errores)
- [ ] ✓ Puedes registrarte (usuario normal)
- [ ] ✓ Puedes acceder a Admin Panel (con tu email)
- [ ] ✓ Dashboard muestra (vacío inicialmente)
- [ ] ✓ Agregaste 2-3 videos
- [ ] ✓ Asignaste videos a un usuario
- [ ] ✓ Usuario normal ve sus videos asignados
- [ ] ✓ Los videos se reproducen desde YouTube
- [ ] ✓ Se ve bien en móvil (abre localhost:3000 en teléfono)

Si todo esto funciona: **MVP COMPLETADO** 🎉

---

## 🐛 Troubleshooting Común

### "Error: Firebase not initialized"
→ Verifica que `firebase.js` tiene tus credenciales CORRECTAS

### "No veo el botón Admin Panel"
→ Verifica que el email en `AuthContext.jsx` es exacto
→ Salir y volver a entrar

### "Los videos no cargan"
→ Verifica que el link es válido: `youtu.be/xxxx` o `youtube.com/watch?v=xxxx`
→ El video DEBE estar "no listado" en YouTube

### "TypeError: db is not defined"
→ Reinicia el frontend: Ctrl+C en la terminal y `npm run dev` de nuevo
→ Verifica que `firebase.js` exporta `db` correctamente

---

## 📞 Próximos Pasos Después del MVP

1. **Testing con clientes reales** (tus 5 early adopters)
2. **Feedback + iteración** (mejoras rápidas)
3. **Mejorar interfaz de asignación** (UI mejor para admin)
4. **Integrar pagos** (Stripe automático)
5. **v1.1: Suscripciones automáticas**

---

**¿En qué paso estás?** Dame feedback y avanzamos juntos. 🚀
