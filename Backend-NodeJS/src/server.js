import cors from 'cors';
import express from 'express';
import { pool } from './db.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:4200' }));
app.use(express.json());

const toTodo = (row) => ({
  id: row.id,
  title: row.title,
  completed: Boolean(row.completed),
  createdAt: row.created_at,
});

const isTitle = (title) => typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 160;

app.get('/health', async (_request, response) => {
  await pool.query('SELECT 1');
  response.json({ status: 'ok' });
});

app.get('/api/todos', async (_request, response) => {
  const [rows] = await pool.query('SELECT id, title, completed, created_at FROM todos ORDER BY id DESC');
  response.json(rows.map(toTodo));
});

app.post('/api/todos', async (request, response) => {
  const { title } = request.body;
  if (!isTitle(title)) return response.status(400).json({ message: 'title es obligatorio y debe tener máximo 160 caracteres.' });
  const [result] = await pool.execute('INSERT INTO todos (title) VALUES (?)', [title.trim()]);
  const [rows] = await pool.execute('SELECT id, title, completed, created_at FROM todos WHERE id = ?', [result.insertId]);
  return response.status(201).json(toTodo(rows[0]));
});

app.patch('/api/todos/:id', async (request, response) => {
  const id = Number(request.params.id);
  const { title, completed } = request.body;
  if (!Number.isInteger(id) || id < 1) return response.status(400).json({ message: 'id inválido.' });
  if (title !== undefined && !isTitle(title)) return response.status(400).json({ message: 'title inválido.' });
  if (completed !== undefined && typeof completed !== 'boolean') return response.status(400).json({ message: 'completed debe ser boolean.' });
  if (title === undefined && completed === undefined) return response.status(400).json({ message: 'Envía title o completed.' });

  const [result] = await pool.execute(
    'UPDATE todos SET title = COALESCE(?, title), completed = COALESCE(?, completed) WHERE id = ?',
    [title?.trim() ?? null, completed ?? null, id],
  );
  if (!result.affectedRows) return response.status(404).json({ message: 'Tarea no encontrada.' });
  const [rows] = await pool.execute('SELECT id, title, completed, created_at FROM todos WHERE id = ?', [id]);
  return response.json(toTodo(rows[0]));
});

app.delete('/api/todos/:id', async (request, response) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) return response.status(400).json({ message: 'id inválido.' });
  const [result] = await pool.execute('DELETE FROM todos WHERE id = ?', [id]);
  if (!result.affectedRows) return response.status(404).json({ message: 'Tarea no encontrada.' });
  return response.status(204).send();
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'Error inesperado en la API.' });
});

app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
