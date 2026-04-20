import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  const fetchPlayer = async () => {
    try {
      const response = await axios.get(`/api/players/${id}`);
      setPlayer(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!player) return <div className="no-content">Joueur non trouvé</div>;

  return (
    <div className="card">
      <h1 style={{ marginBottom: '2rem' }}>{player.name}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Infos Personnelles</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Poste:</strong> {player.position || '-'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Club:</strong> {player.club || '-'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Taille:</strong> {player.height ? `${player.height}cm` : '-'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Poids:</strong> {player.weight ? `${player.weight}kg` : '-'}
          </div>
          {player.birthDate && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Date de naissance:</strong> {player.birthDate}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem' }}>Parcours</h3>
          <p style={{ color: '#666' }}>Ajout du suivi du parcours en cours...</p>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>Entraînements Personnalisés</h3>
        <p style={{ color: '#666' }}>Gestion des workouts spécifiques au joueur en cours...</p>
      </div>
    </div>
  );
}

export default PlayerDetail;
