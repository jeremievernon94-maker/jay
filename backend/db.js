const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'basketball.db');
const db = new sqlite3.Database(dbPath);

const database = {
  init() {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          position TEXT,
          height REAL,
          weight REAL,
          club TEXT,
          birthDate TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          duration INTEGER,
          date TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS player_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          playerId INTEGER,
          date TEXT,
          weight REAL,
          height REAL,
          notes TEXT,
          FOREIGN KEY(playerId) REFERENCES players(id)
        )
      `);
    });
  },

  getPlayers(callback) {
    db.all('SELECT * FROM players ORDER BY name', callback);
  },

  addPlayer(name, position, height, weight, club, birthDate, callback) {
    db.run(
      'INSERT INTO players (name, position, height, weight, club, birthDate) VALUES (?, ?, ?, ?, ?, ?)',
      [name, position, height, weight, club, birthDate],
      callback
    );
  },

  getPlayerById(id, callback) {
    db.get('SELECT * FROM players WHERE id = ?', [id], callback);
  },

  getWorkouts(callback) {
    db.all('SELECT * FROM workouts ORDER BY date DESC', callback);
  },

  addWorkout(name, description, duration, date, callback) {
    db.run(
      'INSERT INTO workouts (name, description, duration, date) VALUES (?, ?, ?, ?)',
      [name, description, duration, date],
      callback
    );
  },

  addProgress(playerId, date, weight, height, notes, callback) {
    db.run(
      'INSERT INTO player_progress (playerId, date, weight, height, notes) VALUES (?, ?, ?, ?, ?)',
      [playerId, date, weight, height, notes],
      callback
    );
  }
};

module.exports = database;
