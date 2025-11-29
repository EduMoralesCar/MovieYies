# Manual de Usuario y Documentación Técnica - MovieYies

## 1. Introducción
Bienvenido a **MovieYies**, su plataforma de streaming favorita. Este manual describe el funcionamiento del sistema, desde la perspectiva del usuario final hasta la arquitectura técnica subyacente.

## 2. Funcionalidades Principales

### 2.1 Registro y Autenticación
- **Registro**: Los nuevos usuarios pueden crear una cuenta proporcionando un correo electrónico y una contraseña.
- **Login**: Acceso seguro mediante credenciales.

### 2.2 Gestión de Perfiles
- Cada cuenta de usuario puede tener múltiples perfiles (ej. para diferentes miembros de la familia).
- **Perfiles Kids**: Opción para marcar un perfil como "Infantil" para restringir contenido.

### 2.3 Planes de Suscripción
MovieYies ofrece 3 niveles de servicio para adaptarse a sus necesidades:
1.  **Básico**: Acceso estándar, 1 pantalla.
2.  **Estándar**: Calidad HD, 2 pantallas simultáneas.
3.  **Premium**: Calidad 4K, 4 pantallas simultáneas.

### 2.4 Reproducción de Contenido
- Exploración de catálogo por géneros (Acción, Comedia, etc.).
- Reproductor de video integrado.
- Historial de visualización y "Continuar viendo".

## 3. Panel de Administración
Los administradores tienen acceso a un dashboard exclusivo para:
- Gestionar el catálogo de películas y series (CRUD).
- Ver estadísticas de usuarios y suscripciones activas.

### 3.1 Resumen de Métricas (Dashboard)
Al acceder al panel de administración, el sistema presenta un **tablero de control (Dashboard)** diseñado para ofrecer una visión rápida del estado actual de la plataforma.

1.  **Total Usuarios**: Cantidad total de cuentas registradas.
2.  **Suscripciones Activas**: Usuarios con plan vigente y acceso al contenido.
3.  **Canceladas**: Suscripciones que han expirado o sido canceladas.

---

## 4. Arquitectura del Sistema (Diagramas UML)

A continuación se presentan los diagramas técnicos que describen la estructura y comportamiento del sistema MovieYies.

### 4.1 Diagrama de Casos de Uso
Describe las interacciones entre los usuarios (Visitante, Suscriptor, Admin) y el sistema.

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Visitante" as Visitor
actor "Usuario Suscriptor" as User
actor "Administrador" as Admin

rectangle "Sistema MovieYies" {
  usecase "Registrarse" as UC1
  usecase "Iniciar Sesión" as UC2
  
  package "Gestión de Cuenta" {
    usecase "Gestionar Perfiles" as UC3
    usecase "Elegir/Cambiar Plan\n(Básico, Estándar, Premium)" as UC4
    usecase "Cancelar Suscripción" as UC5
  }

  package "Consumo de Contenido" {
    usecase "Explorar Catálogo" as UC6
    usecase "Ver Película/Serie" as UC7
    usecase "Calificar Contenido" as UC8
    usecase "Ver Historial" as UC9
  }

  package "Administración" {
    usecase "Gestionar Películas (CRUD)" as UC10
    usecase "Ver Estadísticas de Ventas" as UC11
    usecase "Gestionar Usuarios" as UC12
  }
}

Visitor --> UC1
Visitor --> UC2

User --> UC3
User --> UC4
User --> UC5
User --> UC6
User --> UC7
User --> UC8
User --> UC9

Admin --> UC10
Admin --> UC11
Admin --> UC12
Admin -|> User
@enduml
```

### 4.2 Diagrama de Clases
Representa el modelo de datos y las relaciones entre las entidades principales (Usuario, Perfil, Película, Suscripción).

```plantuml
@startuml
skinparam classAttributeIconSize 0

class Usuario {
  +Integer id
  +String username
  +String email
  +String password
  +String telefono
  +String rol
  +register()
  +login()
}

class Perfil {
  +Integer id
  +String nombre
  +String avatar
  +Boolean es_nino
  +create()
  +update()
}

class Suscripcion {
  +Integer id
  +String plan
  +Date fecha_inicio
  +Date fecha_fin
  +Boolean esta_activo
  +String metodo_pago
  +cambiarPlan(nuevoPlan)
  +cancelar()
}

enum PlanType {
  BASICO
  ESTANDAR
  PREMIUM
}

class Pelicula {
  +Integer id
  +String titulo
  +String descripcion
  +Date fecha_lanzamiento
  +String genero
  +String tipo
  +String video_url
  +Integer duracion_minutos
  +play()
}

class Historial {
  +Integer id
  +DateTime visto_en
  +Integer progreso_segundos
}

class Calificacion {
  +Integer id
  +Integer puntuacion
}

Usuario "1" *-- "*" Perfil : tiene >
Usuario "1" -- "1" Suscripcion : tiene >
Suscripcion ..> PlanType : usa
Perfil "1" -- "*" Historial : genera >
Pelicula "1" -- "*" Historial : registrado en >
Perfil "1" -- "*" Calificacion : realiza >
Pelicula "1" -- "*" Calificacion : recibe >
@enduml
```

### 4.3 Diagrama de Secuencia: Compra de Suscripción
Detalla el flujo de información cuando un usuario adquiere un plan.

```plantuml
@startuml
actor Usuario
participant "Frontend (React)" as FE
participant "Backend API (Django)" as BE
database "Base de Datos" as DB

Usuario -> FE: Selecciona Plan (Básico/Estándar/Premium)
activate FE
FE -> FE: Validar selección
FE -> BE: PATCH /api/suscripcion/me/ (plan, metodo_pago)
activate BE

BE -> DB: Buscar Suscripción del Usuario
activate DB
DB --> BE: Retorna Suscripción (o crea nueva)
deactivate DB

BE -> BE: Validar Pago (Simulado)
BE -> BE: Actualizar estado y fechas

BE -> DB: Guardar cambios en Suscripción
activate DB
DB --> BE: Confirmación OK
deactivate DB

BE --> FE: 200 OK (Datos actualizados)
deactivate BE

FE -> Usuario: Mostrar mensaje "Suscripción Activa"
deactivate FE
@enduml
```

### 4.4 Diagrama Entidad-Relación (ERD)
Esquema de la base de datos relacional.

```plantuml
@startuml
!define TABLE(name,desc) class name as "desc" << (T,#FFAAAA) >>
!define PK(x) <b>x</b>
!define FK(x) <u>x</u>

hide methods
hide stereotypes

TABLE(Usuario, "auth_user") {
  PK(id) : Integer
  username : Varchar
  email : Varchar
  password : Varchar
  rol : Varchar
}

TABLE(Perfil, "core_perfil") {
  PK(id) : Integer
  FK(usuario_id) : Integer
  nombre : Varchar
  avatar : Varchar
  es_nino : Boolean
}

TABLE(Suscripcion, "core_suscripcion") {
  PK(id) : Integer
  FK(usuario_id) : Integer
  plan : Varchar (BASICO, ESTANDAR, PREMIUM)
  fecha_inicio : Date
  fecha_fin : Date
  esta_activo : Boolean
}

TABLE(Pelicula, "core_pelicula") {
  PK(id) : Integer
  titulo : Varchar
  tipo : Varchar
  genero : Varchar
  video_url : Varchar
}

TABLE(Historial, "core_historial") {
  PK(id) : Integer
  FK(perfil_id) : Integer
  FK(pelicula_id) : Integer
  visto_en : DateTime
  progreso : Integer
}

Usuario ||--|{ Perfil
Usuario ||--|| Suscripcion
Perfil ||--|{ Historial
Pelicula ||--|{ Historial
@enduml
```

### 4.5 Diagrama de Secuencia: Gestión de Películas (Admin)
Muestra el proceso que sigue un administrador para agregar nuevo contenido al catálogo.

```plantuml
@startuml
actor Administrador
participant "Admin Dashboard" as Dash
participant "Backend API" as API
database "Base de Datos" as DB

Administrador -> Dash: Acceder a "Gestión de Películas"
activate Dash
Dash -> API: GET /api/peliculas/
activate API
API -> DB: Consultar Películas
activate DB
DB --> API: Lista de Películas
deactivate DB
API --> Dash: JSON (Lista)
deactivate API

Administrador -> Dash: Clic en "Agregar Película"
Dash -> Dash: Mostrar Formulario
Administrador -> Dash: Rellenar datos (Título, URL, etc.)
Administrador -> Dash: Guardar

Dash -> API: POST /api/peliculas/
activate API
API -> API: Validar Permisos (IsAdmin)
API -> API: Validar Datos
API -> DB: INSERT Pelicula
activate DB
DB --> API: ID generado
deactivate DB
API --> Dash: 201 Created
deactivate API

Dash -> Administrador: Mostrar mensaje "Película Agregada"
Dash -> Dash: Actualizar Lista
deactivate Dash
@enduml
```

### 4.6 Diagrama de Estados: Ciclo de Vida de la Suscripción
Ilustra los diferentes estados por los que puede pasar la suscripción de un usuario.

```plantuml
@startuml
[*] --> Inactiva : Registro de Usuario

Inactiva --> Activa : Realizar Pago
Activa --> Cancelada : Usuario Cancela
Cancelada --> Activa : Reactivar Suscripción
Activa --> Vencida : Error de Pago / Fin de Periodo
Vencida --> Activa : Actualizar Método de Pago
Activa --> Activa : Cambiar Plan (Upgrade/Downgrade)

state Activa {
  [*] --> Basico
  Basico --> Estandar : Upgrade
  Estandar --> Premium : Upgrade
  Premium --> Estandar : Downgrade
  Estandar --> Basico : Downgrade
}

Cancelada --> [*] : Eliminar Cuenta
@enduml
```

### 4.7 Diagrama de Actividades: Flujo de Visualización
Describe el flujo de decisiones desde que el usuario entra hasta que ve una película.

```plantuml
@startuml
start
:Usuario entra a la plataforma;

if (¿Está logueado?) then (no)
  :Redirigir a Login;
  :Usuario ingresa credenciales;
else (si)
endif

:Mostrar Pantalla de Selección de Perfil;
:Usuario selecciona Perfil;

:Mostrar Home / Catálogo;
:Usuario selecciona una Película;

if (¿Tiene Suscripción Activa?) then (no)
  :Redirigir a Planes;
  stop
else (si)
  if (¿Es perfil de niño?) then (si)
    if (¿Contenido apto?) then (no)
      :Mostrar "Contenido Restringido";
      stop
    else (si)
    endif
  else (no)
  endif
  
  :Cargar Reproductor de Video;
  :Reproducir Contenido;
  
  fork
    :Usuario ve la película;
  fork again
    :Sistema actualiza Historial (cada 30s);
  end fork
  
  :Fin de la película;
  stop
endif
@enduml
```

### 4.8 Diagrama de Componentes
Muestra la arquitectura de alto nivel y las tecnologías involucradas.

```plantuml
@startuml
package "Cliente (Frontend)" {
  [Navegador Web] as Browser
  [React App] as React
}

package "Servidor (Backend)" {
  [Django REST Framework] as API
  [Auth System] as Auth
  [Admin Panel] as Admin
}

database "Persistencia" {
  [SQLite / PostgreSQL] as DB
}

cloud "Servicios Externos" {
  [Proveedor de Video (Embeds)] as Video
  [Pasarela de Pagos (Simulada)] as Stripe
}

Browser --> React : Renderiza
React --> API : JSON / HTTP Requests
API --> Auth : Valida Tokens (JWT)
API --> Admin : Gestiona Contenido
API --> DB : Lee/Escribe Datos
API --> Stripe : Procesa Pagos
React --> Video : Carga iFrames
@enduml
```

## 5. Referencias Bibliográficas y Tecnologías

El desarrollo de este sistema se ha basado en la documentación oficial de las siguientes tecnologías y herramientas:

### 5.1 Backend y API
*   **Django Project**: Documentación oficial del framework web de alto nivel para Python.
    *   *URL*: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)
*   **Django REST Framework (DRF)**: Herramienta potente y flexible para construir Web APIs.
    *   *URL*: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
*   **Python**: Lenguaje de programación utilizado para la lógica del servidor.
    *   *URL*: [https://docs.python.org/3/](https://docs.python.org/3/)

### 5.2 Frontend e Interfaz
*   **React**: Biblioteca de JavaScript para construir interfaces de usuario.
    *   *URL*: [https://es.react.dev/](https://es.react.dev/)
*   **Vite**: Herramienta de construcción frontend de próxima generación.
    *   *URL*: [https://vitejs.dev/guide/](https://vitejs.dev/guide/)
*   **MDN Web Docs**: Referencia para HTML, CSS y JavaScript estándar.
    *   *URL*: [https://developer.mozilla.org/es/](https://developer.mozilla.org/es/)

### 5.3 Herramientas y Servicios Externos
*   **PlantUML**: Herramienta utilizada para la generación de diagramas UML.
    *   *URL*: [https://plantuml.com/es/](https://plantuml.com/es/)
*   **VidSrc API**: Servicio utilizado para la incrustación de reproductores de video basados en IMDB ID.
    *   *URL*: [https://vidsrc.xyz/](https://vidsrc.xyz/)
