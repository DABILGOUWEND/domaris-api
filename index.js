require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Pool de connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Exemple de route : récupérer la liste des programmes
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur requête programmes', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Exemple POST pour créer un programme
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      'INSERT INTO users  (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur création programme', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
