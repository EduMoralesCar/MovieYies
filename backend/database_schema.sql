-- Script de creación de tablas para la aplicación MovieYies (MySQL)
-- Generado basado en los modelos de Django (core/models.py)

CREATE DATABASE IF NOT EXISTS yies_streaming;
USE yies_streaming;


SET FOREIGN_KEY_CHECKS=0;

-- Tabla: Usuario (Extiende AbstractUser)
CREATE TABLE `core_usuario` (
  `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL UNIQUE,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL UNIQUE,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `telefono` varchar(15) NULL,
  `rol` varchar(10) NOT NULL DEFAULT 'user'
);

-- Tabla: Perfil
CREATE TABLE `core_perfil` (
  `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `nombre` varchar(50) NOT NULL,
  `avatar` varchar(200) NOT NULL DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
  `es_nino` tinyint(1) NOT NULL DEFAULT 0,
  `usuario_id` bigint NOT NULL,
  CONSTRAINT `core_perfil_usuario_id_fk_core_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `core_usuario` (`id`)
);

-- Tabla: Pelicula (Incluye Series)
CREATE TABLE `core_pelicula` (
  `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `titulo` varchar(255) NOT NULL,
  `descripcion` longtext NOT NULL,
  `fecha_lanzamiento` date NOT NULL,
  `genero` varchar(20) NOT NULL,
  `tipo` varchar(10) NOT NULL DEFAULT 'movie',
  `poster_url` varchar(200) NOT NULL,
  `backdrop_url` varchar(200) NULL,
  `video_url` varchar(200) NULL,
  `imdb_id` varchar(20) NULL,
  `duracion_minutos` int NULL,
  `creado_en` datetime(6) NOT NULL
);

-- Tabla: Suscripcion
CREATE TABLE `core_suscripcion` (
  `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `plan` varchar(20) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NULL,
  `esta_activo` tinyint(1) NOT NULL DEFAULT 1,
  `metodo_pago` varchar(50) NOT NULL DEFAULT 'Visa terminada en 4242',
  `usuario_id` bigint NOT NULL UNIQUE,
  CONSTRAINT `core_suscripcion_usuario_id_fk_core_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `core_usuario` (`id`)
);

-- Tabla: Historial
CREATE TABLE `core_historial` (
  `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `visto_en` datetime(6) NOT NULL,
  `progreso_segundos` int NOT NULL DEFAULT 0,
  `pelicula_id` bigint NOT NULL,
  `perfil_id` bigint NOT NULL,
  CONSTRAINT `core_historial_pelicula_id_fk_core_pelicula_id` FOREIGN KEY (`pelicula_id`) REFERENCES `core_pelicula` (`id`),
  CONSTRAINT `core_historial_perfil_id_fk_core_perfil_id` FOREIGN KEY (`perfil_id`) REFERENCES `core_perfil` (`id`)
);

-- Tabla: Calificacion
CREATE TABLE `core_calificacion` (
  `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `puntuacion` int NOT NULL,
  `pelicula_id` bigint NOT NULL,
  `perfil_id` bigint NOT NULL,
  CONSTRAINT `core_calificacion_pelicula_id_fk_core_pelicula_id` FOREIGN KEY (`pelicula_id`) REFERENCES `core_pelicula` (`id`),
  CONSTRAINT `core_calificacion_perfil_id_fk_core_perfil_id` FOREIGN KEY (`perfil_id`) REFERENCES `core_perfil` (`id`),
  CONSTRAINT `core_calificacion_unique_perfil_pelicula` UNIQUE (`perfil_id`, `pelicula_id`)
);

SET FOREIGN_KEY_CHECKS=1;
