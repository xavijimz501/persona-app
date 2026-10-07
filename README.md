# Directorio de personas

CRUD responsivo para administrar personas y empresas, con React + Vite, Node.js + Express, MySQL y Nginx. La interfaz se publica en **http://localhost/registro/** y la API bajo `/api/personas`.

## Estructura

```text
persona-app/
├── backend/
│   ├── src/config/db.js                 # Pool MySQL
│   ├── src/controllers/personasController.js
│   ├── src/middleware/validatePersona.js
│   ├── src/routes/personasRoutes.js
│   ├── src/server.js
│   └── .env.example
├── database/personas.sql                # Esquema y datos de ejemplo
├── nginx/default.conf                   # SPA /registro y proxy /api
├── src/
│   ├── components/PersonaForm.jsx
│   ├── components/PersonasTable.jsx
│   ├── services/personas.js
│   ├── App.jsx
│   └── App.css
├── docker-compose.yml
└── vite.config.js
```

## Opción A: levantar todo con Docker (incluye Nginx)

Requiere Docker Desktop con Docker Compose. Desde la raíz del proyecto:

```bash
docker compose up --build
```

Abre [http://localhost/registro/](http://localhost/registro/). La base se crea e inicializa con los registros de ejemplo la primera vez. Para detener los contenedores usa `Ctrl+C` y luego `docker compose down`. Los datos persisten en el volumen `mysql_data`; para borrar también la base local usa `docker compose down -v`.

Puedes definir `MYSQL_ROOT_PASSWORD` en el entorno antes de ejecutar Compose. El valor local por defecto es `root_local`; cámbialo para entornos que no sean de desarrollo.

## Opción B: desarrollo local con MySQL instalado

### 1. Crear la base

Asegúrate de que MySQL esté activo y ejecuta desde la raíz:

```bash
mysql -u root -p < database/personas.sql
```

El script crea `personas_db`, la tabla `personas` y cuatro registros de ejemplo. Si tu usuario no se llama `root`, ajusta el comando.

### 2. Iniciar el backend

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env` con tus credenciales MySQL. Instala dependencias e inicia el servidor:

```bash
npm install
npm run dev
```

La API escucha en `http://localhost:3000`. El backend valida los datos y usa consultas parametrizadas.

### 3. Iniciar el frontend

En otra terminal, vuelve a la raíz del proyecto:

```bash
npm install
npm run dev
```

Vite abre su propio puerto (normalmente `http://localhost:5173`). El proxy de desarrollo reenvía `/api` a Express. Para esta modalidad visita **http://localhost:5173/registro/**. En producción Nginx publica la ruta solicitada en `http://localhost/registro/`.

### 4. (Opcional) Nginx local

Para servir el build en `localhost/registro/` y dirigir `/api` a Express, compila el frontend (`npm run build`) y configura Nginx con `nginx/default.conf`. El ejemplo incluido asume que los archivos compilados se encuentran en `/usr/share/nginx/html/registro` y que el backend se resuelve como `backend:3000` (como en Docker Compose).

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/personas?page=1&limit=8&search=ana` | Lista filtrada y paginada. Devuelve `data` y metadatos `pagination`. La búsqueda consulta nombre, empresa, correo, teléfono y entidad. |
| `GET` | `/api/personas/:id` | Consulta una persona. |
| `POST` | `/api/personas` | Crea una persona. |
| `PUT` | `/api/personas/:id` | Actualiza todos los campos editables. |
| `DELETE` | `/api/personas/:id` | Elimina una persona (respuesta `204`). |

El cuerpo de creación y actualización debe ser JSON:

```json
{
  "nombre": "Ana García",
  "nombre_empresa": "Norte Studio",
  "correo": "ana@ejemplo.mx",
  "telefono": "+52 55 1234 5678",
  "entidad": "Ciudad de México"
}
```

`id` y `created_at` se generan en MySQL. El correo debe ser único. Los campos son obligatorios y se validan tanto en la interfaz como en el servidor.
