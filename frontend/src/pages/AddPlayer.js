import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddPlayer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    height: '',
    weight: '',
    club: '',
    birthDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/players', formData);
      navigate('/');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout du joueur');
    }
  };

  return (
    <div className="card">
      <h1 style={{ marginBottom: '2rem' }}>Ajouter un Joueur</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ex: LeBron James"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Poste</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Ex: Ailier"
            />
          </div>
          <div className="form-group">
            <label>Club</label>
            <input
              type="text"
              name="club"
              value={formData.club}
              onChange={handleChange}
              placeholder="Ex: Lakers"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Taille (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Ex: 203"
            />
          </div>
          <div className="form-group">
            <label>Poids (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              placeholder="Ex: 113.4"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Date de naissance</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Ajouter le Joueur</button>
      </form>
    </div>
  );
}

export default AddPlayer;
