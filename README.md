# 🎬 MovieYies

**MovieYies** es una plataforma de streaming de películas y series inspirada en Netflix. Permite a los usuarios explorar, ver y calificar contenido multimedia, gestionar múltiples perfiles por cuenta y disfrutar de una experiencia de usuario moderna y fluida.

---

## ✨ Características Principales

- 🔐 **Autenticación de usuarios** - Registro e inicio de sesión seguro
- 👥 **Múltiples perfiles por cuenta** - Cada usuario puede crear varios perfiles (incluyendo perfiles infantiles)
- 🎥 **Catálogo de películas y series** - Explora contenido organizado por géneros
- 📺 **Reproductor de video integrado** - Visualiza contenido directamente en la plataforma
- ⭐ **Sistema de calificaciones** - Puntúa el contenido que has visto
- 📜 **Historial de visualización** - Mantiene un registro del progreso de reproducción
- 💳 **Planes de suscripción** - Básico, Estándar y Premium
- 🛠️ **Panel de administración** - Gestión completa del contenido y usuarios

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.8+** - Lenguaje de programación
- **Django** - Framework web
- **Django REST Framework** - API REST
- **MySQL** - Base de datos

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Herramienta de construcción
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

---

## 📦 Guía de Instalación

Sigue estos pasos para levantar el proyecto en tu entorno local.

## Requisitos Previos
- Python 3.8+
- Node.js 16+
- MySQL Server

## 1. Configuración del Backend (Django)

1. **Crear entorno virtual:**
   ```bash
   cd backend
   python -m venv venv

   # Linux/Mac:
   source venv/bin/activate

   # En Windows:
   venv\Scripts\activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar Base de Datos:**
   - Crea una base de datos vacía en MySQL llamada `yies_streaming`.
   - Asegúrate de que `backend/config/settings.py` tenga las credenciales correctas de tu MySQL (usuario y contraseña).

4. **Ejecutar Migraciones:**
   ```bash
   python manage.py migrate
   ```

5. **Poblar la Base de Datos (IMPORTANTE):**
   Ejecuta este comando para descargar automáticamente películas y series:
   ```bash
   python manage.py seed_data
   ```

6. **Crear Superusuario (Opcional):**
   *Nota: El primer usuario que se registre desde el Frontend automáticamente será Administrador.*
   
   Si prefieres crear uno manualmente desde la terminal:
   ```bash
   python manage.py createsuperuser
   ```
   *(Te pedirá un email y contraseña. Esas serán tus credenciales para el panel de administración).*

7. **Correr el servidor:**
   ```bash
   python manage.py runserver
   # Tambien puedes usar:
   ..\venv\Scripts\python manage.py runserver
   ```

## 2. Configuración del Frontend (React)

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Correr el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 3. Acceso
- **Frontend:** http://localhost:5173
- **Backend Admin:** http://localhost:8000/admin (credenciales: son las mismas que las de tu usuario administrador)

¡Listo! Disfruta de MovieYies. 🍿

---

## 📁 Estructura del Proyecto

```
MovieYies/
├── backend/                 # API REST con Django
│   ├── api/                 # Endpoints y serializadores
│   ├── core/                # Modelos de datos
│   ├── config/              # Configuración de Django
│   └── requirements.txt     # Dependencias de Python
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   └── utils/           # Utilidades
│   └── package.json         # Dependencias de Node.js
└── README.md
```

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

Hecho con ❤️ por el equipo de MovieYies
