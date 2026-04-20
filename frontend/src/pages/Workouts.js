import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    date: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/workouts', formData);
      setFormData({ name: '', description: '', duration: '', date: '' });
      setShowForm(false);
      fetchWorkouts();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout du workout');
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'white' }}>Entraînements</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Ajouter un Entraînement'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Créer un Entraînement</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: Tir à 3 points"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Détails de l'entraînement..."
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Durée (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 60"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Créer l'Entraînement</button>
          </form>
        </div>
      )}

      <div>
        {workouts.length === 0 ? (
          <div className="no-content">
            <p>Aucun entraînement enregistré. Créez-en un !</p>
          </div>
        ) : (
          <div>
            {workouts.map(workout => (
              <div key={workout.id} className="workout-item">
                <div className="workout-title">{workout.name}</div>
                {workout.date && (
                  <div className="workout-details">
                    <strong>Date:</strong> {new Date(workout.date).toLocaleDateString('fr-FR')}
                  </div>
                )}
                {workout.duration && (
                  <div className="workout-details">
                    <strong>Durée:</strong> {workout.duration} minutes
                  </div>
                )}
                {workout.description && (
                  <div className="workout-details">
                    <strong>Description:</strong> {workout.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
