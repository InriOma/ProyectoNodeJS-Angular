import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'todos_user',
  password: process.env.DB_PASSWORD ?? 'todos_password',
  database: process.env.DB_NAME ?? 'todos_lab',
  waitForConnections: true,
  connectionLimit: 10,
});
