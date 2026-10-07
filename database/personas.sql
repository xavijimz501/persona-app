SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS personas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE personas_db;

CREATE TABLE IF NOT EXISTS personas (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  nombre_empresa VARCHAR(180) NOT NULL,
  correo VARCHAR(190) NOT NULL UNIQUE,
  telefono VARCHAR(25) NOT NULL,
  entidad VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_personas_nombre (nombre),
  INDEX idx_personas_empresa (nombre_empresa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO personas (nombre, nombre_empresa, correo, telefono, entidad) VALUES
('Ana García', 'Norte Studio', 'ana.garcia@nortestudio.mx', '+52 55 1234 5678', 'Ciudad de México'),
('Luis Hernández', 'Punto Azul', 'luis@puntoazul.mx', '+52 81 9876 5432', 'Nuevo León'),
('María López', 'Verde Claro', 'maria.lopez@verdeclaro.mx', '+52 33 2222 1111', 'Jalisco'),
('Diego Ruiz', 'Taller Central', 'diego@tallercentral.mx', '+52 222 456 7890', 'Puebla');

