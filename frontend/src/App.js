import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PlayersList from './pages/PlayersList';
import PlayerDetail from './pages/PlayerDetail';
import AddPlayer from './pages/AddPlayer';
import Workouts from './pages/Workouts';
import './styles.css';

function App() {
  const location = useLocation();

  const isAddPlayer = location.pathname === '/add-player';
  const isWorkouts = location.pathname === '/workouts';
  const isPlayerDetail = location.pathname.startsWith('/player/');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            🏀 Basket Coach
          </Link>
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<PlayersList />} />
          <Route path="/add-player" element={<AddPlayer />} />
          <Route path="/player/:id" element={<PlayerDetail />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>

      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${!isAddPlayer && !isWorkouts && !isPlayerDetail ? 'active' : ''}`}>
          <span className="nav-icon">👥</span>
          <span className="nav-label">Joueurs</span>
        </Link>
        <Link to="/add-player" className={`nav-item ${isAddPlayer ? 'active' : ''}`}>
          <span className="nav-icon">➕</span>
          <span className="nav-label">Ajouter</span>
        </Link>
        <Link to="/workouts" className={`nav-item ${isWorkouts ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Workouts</span>
        </Link>
      </nav>
    </div>
  );
}

export default App;
