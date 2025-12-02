# Guía de Instalación para MovieYies

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

# Capturas de Pantalla de MovieYies
## 1. Reistro de Autenticación
> Los nuevos usuarios pueden crear una cuenta proporcionando un correo 
electrónico y una contraseña.

## 2. Login
> Acceso seguro mediante credenciales.

## 3. Planes de Suscriptción
> MovieYies ofrece 3 niveles de servicio para adaptarse a sus necesidades: 

## 4. Gestion de Usuarios
> Cada cuenta de usuario puede tener múltiples perfiles

## 5. Registro de Contenido
> Exploración de catálogo por géneros (Inicio, Películas, Series, Populares y Mi Lista). 

### 5.1. Inicio
> Catálogo principal con recomendaciones y accesos rápidos.

### 5.2. Peliculas
> Navegación por géneros y títulos destacados.

### 5.3. Series
> Listado de temporadas y capítulos disponibles.

### 5.4. Populares
> Contenidos más vistos y en tendencia.

### 5.5. Mi lista
> Favoritos guardados por el usuario para ver luego.

### 5.6. Información y Reproducir
> Ficha con detalles y botón de reproducción.

#### 5.6.1. Resultado
> Inicio de transmisión del video con controles básicos.
