import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PlayersList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = () => {
    const stored = localStorage.getItem('players');
    setPlayers(stored ? JSON.parse(stored) : []);
  };

  const formatAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div>
      <h1>👥 Mes Joueurs</h1>

      {players.length === 0 ? (
        <div className="no-content">
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Aucun joueur pour le moment</p>
          <p>Clique sur "Ajouter" pour commencer!</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: 'white', fontSize: '0.9rem' }}>
            {players.length} joueur{players.length > 1 ? 's' : ''}
          </div>
          <div className="players-grid">
            {players.map(player => (
              <Link key={player.id} to={`/player/${player.id}`} style={{ textDecoration: 'none' }}>
                <div className="player-card">
                  <div className="player-name">{player.name}</div>

                  {player.position && (
                    <div className="player-info">
                      <strong>Poste</strong>
                      <span>{player.position}</span>
                    </div>
                  )}

                  {player.club && (
                    <div className="player-info">
                      <strong>Club</strong>
                      <span>{player.club}</span>
                    </div>
                  )}

                  {player.height && (
                    <div className="player-info">
                      <strong>Taille</strong>
                      <span>{player.height}cm</span>
                    </div>
                  )}

                  {player.weight && (
                    <div className="player-info">
                      <strong>Poids</strong>
                      <span>{player.weight}kg</span>
                    </div>
                  )}

                  {formatAge(player.birthDate) && (
                    <div className="player-info">
                      <strong>Âge</strong>
                      <span>{formatAge(player.birthDate)} ans</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PlayersList;
