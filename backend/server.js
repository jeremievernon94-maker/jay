const express = require('express');
const cors = require('cors');
require('dotenv').config();
const database = require('./db');
const { questions } = require('./trivia');

const app = express();
app.use(cors());
app.use(express.json());

database.init();

app.get('/api/players', (req, res) => {
  database.getPlayers((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/players', (req, res) => {
  const { name, position, height, weight, club, birthDate } = req.body;
  database.addPlayer(name, position, height, weight, club, birthDate, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Player added' });
  });
});

app.get('/api/players/:id', (req, res) => {
  database.getPlayerById(req.params.id, (err, player) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(player);
  });
});

app.get('/api/workouts', (req, res) => {
  database.getWorkouts((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/workouts', (req, res) => {
  const { name, description, duration, date } = req.body;
  database.addWorkout(name, description, duration, date, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Workout added' });
  });
});

// ─── Trivia routes ────────────────────────────────────────────────────────────
app.get('/api/trivia/questions', (req, res) => {
  const { difficulty, category, limit } = req.query;
  let filtered = [...questions];
  if (difficulty) filtered = filtered.filter(q => q.difficulty === difficulty);
  if (category) filtered = filtered.filter(q => q.category === category);
  // shuffle
  filtered.sort(() => Math.random() - 0.5);
  if (limit) filtered = filtered.slice(0, parseInt(limit));
  res.json(filtered);
});

app.get('/api/trivia/categories', (req, res) => {
  const categories = [...new Set(questions.map(q => q.category))];
  res.json(categories);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
