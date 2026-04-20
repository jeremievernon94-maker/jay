import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlayersList from './pages/PlayersList';
import PlayerDetail from './pages/PlayerDetail';
import AddPlayer from './pages/AddPlayer';
import Workouts from './pages/Workouts';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              🏀 Basketball Tracker
            </Link>
            <div className="nav-menu">
              <Link to="/" className="nav-link">Joueurs</Link>
              <Link to="/add-player" className="nav-link">+ Joueur</Link>
              <Link to="/workouts" className="nav-link">Entraînements</Link>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<PlayersList />} />
            <Route path="/add-player" element={<AddPlayer />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
