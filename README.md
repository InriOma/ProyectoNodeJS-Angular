# Proyecto Node + Angular: laboratorio TODO

Ejemplo educativo full stack: una interfaz Angular consume una API REST de Express; la API guarda tareas en MariaDB. El frontend usa **HttpClient**, la solución HTTP nativa de Angular. Si vienes de React o Next, cumple el mismo papel que Axios, pero no hace falta instalar Axios.

## Estructura

```text
ProyectoNode+Angular/
├── Frontend-Angular/       # Aplicación Angular y laboratorios
├── Backend-NodeJS/         # API Express + mysql2
├── Docker/mariadb/init/    # SQL que se ejecuta al crear la BD
└── docker-compose.yml      # API y MariaDB
```

## Inicio rápido

Requisitos: Docker Desktop iniciado y un navegador.

```bash
docker compose up --build
```

Esto inicia MariaDB en `localhost:3306` y la API en `http://localhost:3000`. En otra terminal, inicia Angular:

```bash
cd Frontend-Angular
npm install
npm start
```

Abre `http://localhost:4200/todos`. Para detener los contenedores usa `docker compose down`. Para borrar también los datos de MariaDB y reiniciar el SQL inicial: `docker compose down -v`.

## API REST

| Método | Ruta | Acción |
| --- | --- | --- |
| GET | `/health` | Comprueba API y base de datos |
| GET | `/api/todos` | Lista tareas |
| POST | `/api/todos` | Crea `{ "title": "Estudiar HTTP" }` |
| PATCH | `/api/todos/:id` | Edita `title` y/o `completed` |
| DELETE | `/api/todos/:id` | Elimina una tarea |

Ejemplo con `curl`:

```bash
curl -X POST http://localhost:3000/api/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"Practicar Express"}'
```

## Notas para IA y futuros cambios

- Las rutas del frontend son lazy-loaded y se definen en `Frontend-Angular/src/app/app.routes.ts`.
- `provideHttpClient()` registra el cliente HTTP en toda la app.
- `TodoApiService` es la única capa que conoce la URL REST. Los componentes no deben hacer peticiones directamente.
- La API usa consultas parametrizadas de `mysql2`; no concatenar valores de usuario en SQL.
- CORS solo permite por defecto el frontend local (`http://localhost:4200`).
- Las credenciales de Compose son didácticas y locales; nunca reutilizarlas en producción.
