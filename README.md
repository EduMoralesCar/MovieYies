<p align="center"><img width="100" height="100" alt="image" src="https://github.com/user-attachments/assets/4496a7c1-9d3a-4328-bf0e-42ebda481ae2" />
</p>

![Typing](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&pause=1000&color=2F80ED&center=true&width=800&lines=Proyecto+Final+de+Lenguajes+de+Programación+%7C+2025)

#

## 💻 Backend & API
<div align="center">

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/Django_REST-ff1744?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
</div>


## 🎨 Frontend & UI

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
</div>


## 🛠️ Herramientas
<div align="center">

[![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://code.visualstudio.com/)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
</div>

---

# 1. Guía de Instalación para MovieYies
> Sigue estos pasos para levantar el proyecto en tu entorno local.

## Requisitos Previos
- Python 3.8+
- Node.js 16+
- MySQL Server

## Implementación Local
**Clona el repositorio:**

   ```bash
    git clone https://github.com/EduMoralesCar/MovieYies.git
    cd MovieYies/
   ```


## Configuración del Backend (Django)

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
- **Acceso al panel de Administración:** http://localhost:8000/admin
  > Credenciales: utiliza el correo y contraseña de tu usuario administrador creado previamente.

¡Listo! Disfruta de MovieYies. 🍿

---

# 2. Capturas de Pantalla de MovieYies
## 1. Reistro de Autenticación
> Los nuevos usuarios pueden crear una cuenta proporcionando un correo 
electrónico y una contraseña.
<img width="1358" height="621" alt="Captura de pantalla 2025-11-29 103917" src="https://github.com/user-attachments/assets/864d60c6-cf66-4002-9cee-25daf1af18af" />

## 2. Login
> Acceso seguro mediante credenciales.
<img width="1357" height="616" alt="Captura de pantalla 2025-11-29 104007" src="https://github.com/user-attachments/assets/32be2a22-a048-4a2c-bb7b-1e2301dbcc8e" />

## 3. Planes de Suscriptción
> MovieYies ofrece 3 niveles de servicio para adaptarse a sus necesidades: 
<img width="1333" height="624" alt="Captura de pantalla 2025-11-29 104120" src="https://github.com/user-attachments/assets/0cd88a30-1f4a-4686-8a58-8dec58ebdf46" />

## 4. Gestion de Usuarios
> Cada cuenta de usuario puede tener múltiples perfiles
<img width="783" height="444" alt="Captura de pantalla 2025-11-29 104419" src="https://github.com/user-attachments/assets/1a400afc-71d5-4cb6-aa89-d2b7f2dcbbe1" />

## 5. Registro de Contenido
> Exploración de catálogo por géneros (Inicio, Películas, Series, Populares y Mi Lista). 
### 5.1. Inicio
> Catálogo principal con recomendaciones y accesos rápidos.
<img width="1910" height="928" alt="Captura de pantalla 2025-11-29 105700" src="https://github.com/user-attachments/assets/8d77ef56-4b12-4680-b9b2-0c507b389a97" />

### 5.2. Peliculas
> Navegación por géneros y títulos destacados.
<img width="1910" height="926" alt="Captura de pantalla 2025-11-29 105753" src="https://github.com/user-attachments/assets/d88a0ae6-b63b-4dd8-b352-24ee45628389" />

### 5.3. Series
> Listado de temporadas y capítulos disponibles.
<img width="1905" height="924" alt="Captura de pantalla 2025-11-29 105821" src="https://github.com/user-attachments/assets/7c8c2566-69cb-43aa-9ebb-16ee077621d8" />

### 5.4. Populares
> Contenidos más vistos y en tendencia.
<img width="1907" height="919" alt="Captura de pantalla 2025-11-29 105859" src="https://github.com/user-attachments/assets/2b5442ca-1b55-473b-96d4-ee6289043b25" />

### 5.5. Mi lista
> Favoritos guardados por el usuario para ver luego.
<img width="1908" height="928" alt="Captura de pantalla 2025-11-29 110031" src="https://github.com/user-attachments/assets/11780163-48c5-441a-b369-a88817bdfe09" />

### 5.6. Información y Reproducir
> Ficha con detalles y botón de reproducción.
<img width="1908" height="924" alt="Captura de pantalla 2025-11-29 110150" src="https://github.com/user-attachments/assets/5b546712-a90a-4dc2-9bc9-f25cd822915d" />

#### 5.6.1. Resultado
> Inicio de transmisión del video con controles básicos.
<img width="1912" height="925" alt="Captura de pantalla 2025-11-29 110122" src="https://github.com/user-attachments/assets/32ca08dc-7fe4-4f1c-96d1-54b96f80a1ab" />

## 6. Panel de Administración
> Espacio exclusivo para el administrador, donde puede gestionar usuarios, perfiles y contenido.
> - Crear, editar o eliminar películas y series.
> - Administrar cuentas y roles de usuario.
> - Revisar estadísticas básicas de uso.
> - Control total del catálogo y la plataforma.

<img width="1915" height="881" alt="Captura de pantalla 2025-11-29 111120" src="https://github.com/user-attachments/assets/9a9fd039-2702-4379-b9e7-e8e40681dd31" />

