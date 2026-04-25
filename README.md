# 💪 Fitness Videos MVP

Plataforma para gestionar y compartir videos de rutinas personalizadas con tus clientes.

## 📋 Características

- ✅ Autenticación segura (email/contraseña + Google)
- ✅ Dashboard para clientes con videos asignados
- ✅ Panel admin para gestionar usuarios y asignaciones
- ✅ Videos de YouTube incrustados
- ✅ Optimizado para mobile-first
- ✅ Orden específico de ejercicios

---

## 🚀 Quick Start

### 1. Clonar/Descargar el proyecto

```bash
# Si usas Git
git clone <tu-repo-url>
cd fitness-videos-mvp

# Si descargaste ZIP, descomprime y entra a la carpeta
cd fitness-videos-mvp
```

### 2. Configurar Firebase

**Paso 1: Obtener credenciales**
1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ir a Configuración (⚙️) → Tus aplicaciones → Selecciona tu aplicación
4. Copia la configuración de Firebase

**Paso 2: Actualizar frontend**
1. Abre `frontend/src/config/firebase.js`
2. Reemplaza los valores con tus credenciales reales:
```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
}
```

**Paso 3: Configurar Firestore**
1. En Firebase Console → Firestore Database
2. Crear base de datos en modo "Iniciar en modo de prueba"
3. Crear estas colecciones vacías:
   - `usuarios`
   - `videos`
   - `asignaciones`

**Paso 4: Configurar Autenticación**
1. Firebase Console → Authentication
2. Habilitar:
   - Email/Contraseña
   - Google

### 3. Instalar dependencias

```bash
# Instalar todas las dependencias (frontend + backend)
npm run install-all
```

O si prefieres instalar por separado:

```bash
# Frontend
cd frontend
npm install

# Backend (en otra terminal)
cd backend
npm install
```

### 4. Ejecutar en desarrollo

```bash
# En la raíz del proyecto, ejecuta ambos:
npm run dev

# O en dos terminales diferentes:

# Terminal 1 - Frontend (http://localhost:3000)
cd frontend
npm run dev

# Terminal 2 - Backend (http://localhost:5000)
cd backend
npm run dev
```

---

## 📱 Probar localmente

1. Abre el navegador en `http://localhost:3000`
2. Registrate con un email/contraseña
3. Verás el Dashboard (vacío al principio)

### Para acceder al Admin Panel:

1. Actualiza `frontend/src/context/AuthContext.jsx`
2. Busca la línea: `setIsAdmin(currentUser.email === 'tu-email@gmail.com')`
3. Reemplaza `'tu-email@gmail.com'` con TU email
4. Ahora, cuando inicies sesión con ese email, verás el botón de Admin

---

## 🌍 Deploy a Producción (Vercel)

### Frontend (React)

1. **Conectar GitHub**
   - Push el proyecto a GitHub
   - Ve a https://vercel.com
   - Click "New Project"
   - Selecciona el repositorio

2. **Configurar**
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Root Directory: `.`

3. **Deploy**
   - Click Deploy
   - Esperá ~2 minutos
   - Tu sitio está en vivo! 🎉

### Backend

Para un MVP simple, **el backend es opcional**. Firebase maneja todo.

Si necesitas backend customizado:
1. Usar Vercel Serverless Functions (recomendado)
2. O deployar en Railway/Render

---

## 🔐 Variables de Entorno

### Frontend (.env - no se trackea en Git)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

### Backend (.env - no se trackea en Git)
```
PORT=5000
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

---

## 📚 Estructura del Proyecto

```
fitness-videos-mvp/
├── frontend/                    # React app
│   ├── src/
│   │   ├── pages/              # LoginRegister, Dashboard, AdminPanel
│   │   ├── components/         # VideoPlayer
│   │   ├── context/            # AuthContext
│   │   ├── config/             # firebase.js
│   │   └── App.jsx             # Router principal
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                    # Node.js + Express (opcional por ahora)
│   ├── src/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── package.json                # Root package.json
└── README.md                   # Este archivo
```

---

## 🛠️ Primeros Pasos Después del MVP

### 1. Testear con clientes
- Invita 5 early adopters
- Usa `http://localhost:3000` o la URL de Vercel
- Recibe feedback

### 2. Mejorar la asignación de videos
- Crear interfaz drag-and-drop para reordenar
- Select visual para elegir videos a asignar

### 3. Agregar datos de usuario
- Edad, peso, objetivo, etc.
- Perfil editable

### 4. Integrar pagos (Stripe)
- Automatizar asignación de videos por plan
- Reemplazar asignación manual

---

## ❓ Troubleshooting

### "Error: Firebase config is invalid"
→ Verifica que copiaste correctamente las credenciales en `firebase.js`

### "No veo cambios en el frontend"
→ Asegúrate de estar en `http://localhost:3000` y el servidor está corriendo

### "No puedo acceder al Admin Panel"
→ Verifica que tu email está configurado en `AuthContext.jsx`

### "Los videos no carga"
→ Verifica que el link de YouTube es válido (youtu.be/xxx o youtube.com/watch?v=xxx)

---

## 📞 Soporte

Si algo no funciona:
1. Revisa la consola del navegador (F12)
2. Revisa la terminal donde ejecutaste `npm run dev`
3. Verifica que Firebase está configurado correctamente

---

## 📝 Roadmap

- [ ] V1.0 MVP (ACTUAL)
- [ ] V1.1 Mejorar UX de admin
- [ ] V1.2 Integrar Stripe
- [ ] V2.0 Suscripciones automáticas
- [ ] V2.1 Analytics y estadísticas
- [ ] V3.0 Comunidad y comentarios

---

**¡Buena suerte! 🚀**
