import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = () => {
    const stored = localStorage.getItem('workouts');
    const data = stored ? JSON.parse(stored) : [];
    setWorkouts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Le nom est obligatoire');
      return;
    }

    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const newWorkout = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    workouts.push(newWorkout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    setFormData({ name: '', description: '', duration: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    fetchWorkouts();
  };

  const deleteWorkout = (id) => {
    if (confirm('Supprimer cet entraînement?')) {
      const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      const filtered = workouts.filter(w => w.id !== id);
      localStorage.setItem('workouts', JSON.stringify(filtered));
      fetchWorkouts();
    }
  };

  return (
    <div>
      <h1>⚙️ Entraînements</h1>

      {showForm && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Nouveau Workout</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom du workout *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Tir à 3 points"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Détails, exercices..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Durée (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 60"
                  min="0"
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

            <button type="submit" className="btn btn-primary">
              ✓ Créer Workout
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
              style={{ marginTop: '0.8rem', width: '100%' }}
            >
              Annuler
            </button>
          </form>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          style={{ marginBottom: '1.5rem', width: '100%' }}
        >
          ➕ Nouveau Workout
        </button>
      )}

      {workouts.length === 0 ? (
        <div className="no-content">
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Aucun entraînement</p>
          <p>Crée ton premier workout!</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: 'white', fontSize: '0.9rem' }}>
            {workouts.length} workout{workouts.length > 1 ? 's' : ''}
          </div>
          <div>
            {workouts.map(workout => (
              <div key={workout.id} className="workout-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div className="workout-title">{workout.name}</div>
                    {workout.date && (
                      <div className="workout-details">
                        <strong>📅</strong> {new Date(workout.date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    {workout.duration && (
                      <div className="workout-details">
                        <strong>⏱️</strong> {workout.duration} min
                      </div>
                    )}
                    {workout.description && (
                      <div className="workout-details" style={{ marginTop: '0.5rem' }}>
                        {workout.description}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    style={{
                      background: '#fee',
                      border: 'none',
                      color: '#c33',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Workouts;
