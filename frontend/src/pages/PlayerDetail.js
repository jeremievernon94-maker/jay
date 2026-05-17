import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  const fetchPlayer = () => {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const found = players.find(p => p.id == id);
    setPlayer(found);
  };

  const deletePlayer = () => {
    if (confirm(`Supprimer ${player.name}?`)) {
      const players = JSON.parse(localStorage.getItem('players') || '[]');
      const filtered = players.filter(p => p.id != id);
      localStorage.setItem('players', JSON.stringify(filtered));
      navigate('/');
    }
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

  if (!player) {
    return (
      <div className="card">
        <h2>Joueur non trouvé</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>{player.name}</h1>
        <button
          onClick={deletePlayer}
          style={{
            background: '#fee',
            border: 'none',
            color: '#c33',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          🗑️ Supprimer
        </button>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>Informations</h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          {player.position && (
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Poste</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#222' }}>
                {player.position}
              </div>
            </div>
          )}

          {player.club && (
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Club</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#222' }}>
                {player.club}
              </div>
            </div>
          )}

          {player.height && (
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Taille</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#222' }}>
                {player.height}cm
              </div>
            </div>
          )}

          {player.weight && (
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Poids</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#222' }}>
                {player.weight}kg
              </div>
            </div>
          )}

          {formatAge(player.birthDate) && (
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Âge</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#222' }}>
                {formatAge(player.birthDate)} ans
              </div>
            </div>
          )}

          {player.birthDate && (
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Date naissance</div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#222' }}>
                {new Date(player.birthDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
          )}
        </div>
      </div>

      <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
        ← Retour aux Joueurs
      </button>
    </div>
  );
}

export default PlayerDetail;
