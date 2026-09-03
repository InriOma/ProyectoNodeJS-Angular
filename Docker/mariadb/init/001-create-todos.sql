CREATE TABLE IF NOT EXISTS todos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

INSERT INTO todos (title, completed) VALUES
  ('Levantar los servicios con Docker Compose', TRUE),
  ('Consumir la API desde Angular', FALSE);
