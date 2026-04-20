import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('/api/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Liste des Joueurs</h1>
      {players.length === 0 ? (
        <div className="no-content">
          <p>Aucun joueur enregistré. Commencez par en ajouter un !</p>
        </div>
      ) : (
        <div className="players-grid">
          {players.map(player => (
            <Link key={player.id} to={`/player/${player.id}`} style={{ textDecoration: 'none' }}>
              <div className="player-card">
                <div className="player-name">{player.name}</div>
                <div className="player-info">
                  <strong>Poste:</strong> {player.position || '-'}
                </div>
                <div className="player-info">
                  <strong>Club:</strong> {player.club || '-'}
                </div>
                <div className="player-info">
                  <strong>Taille:</strong> {player.height ? `${player.height}cm` : '-'}
                </div>
                <div className="player-info">
                  <strong>Poids:</strong> {player.weight ? `${player.weight}kg` : '-'}
                </div>
                {player.birthDate && (
                  <div className="player-info">
                    <strong>Naissance:</strong> {player.birthDate}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayersList;
