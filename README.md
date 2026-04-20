# Basketball Player Tracker

Application web pour les entraîneurs de basketball pour gérer et suivre leurs joueurs.

## Fonctionnalités

✅ **Gestion des Joueurs**
- Créer et enregistrer des profils de joueurs
- Suivre: taille, poids, poste, club
- Historique du parcours des joueurs

✅ **Entraînements Personnalisés**
- Créer et organiser des plans d'entraînement
- Ajouter des descriptions détaillées
- Suivre la durée et la date

✅ **Tableau de bord**
- Vue d'ensemble des joueurs
- Accès rapide aux profils

## Installation

### Prérequis
- Node.js v18+
- npm ou yarn

### Setup

```bash
# Installer les dépendances
npm install

# Lancer les serveurs (dev et frontend)
npm run dev
```

### Serveurs
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Structure du Projet

```
jay/
├── backend/           # API Express
│   ├── server.js      # Point d'entrée
│   ├── db.js          # Gestion SQLite
│   └── package.json
├── frontend/          # App React
│   ├── public/
│   ├── src/
│   │   ├── pages/     # Composants pages
│   │   ├── App.js
│   │   └── styles.css
│   └── package.json
└── package.json       # Root workspace
```

## À Venir

- 📊 Statistiques et graphiques
- 📈 Suivi détaillé du progrès par joueur
- 🎥 Galerie de vidéos d'entraînement
- 📱 Application mobile
- ⚙️ Configuration personnalisée des équipes

## License

MIT
