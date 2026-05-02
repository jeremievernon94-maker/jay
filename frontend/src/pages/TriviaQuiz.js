import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DIFFICULTIES = [
  { key: 'facile',    label: 'Facile',    color: '#27ae60', points: 100, icon: '🟢' },
  { key: 'moyen',     label: 'Moyen',     color: '#f39c12', points: 200, icon: '🟡' },
  { key: 'difficile', label: 'Difficile', color: '#e74c3c', points: 300, icon: '🔴' },
];

const CATEGORIES = [
  { key: 'all',        label: 'Toutes',     icon: '🏀' },
  { key: 'NBA',        label: 'NBA',        icon: '🇺🇸' },
  { key: 'NCAA',       label: 'NCAA',       icon: '🎓' },
  { key: 'France',     label: 'France',     icon: '🇫🇷' },
  { key: 'EuroLeague', label: 'EuroLeague', icon: '🇪🇺' },
];

const TEAM_COLORS = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c'];

const TIMER_SECONDS = 30;

// ─── Setup screen ─────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState(['Équipe 1', 'Équipe 2', 'Équipe 3', 'Équipe 4']);
  const [questionsPerTurn, setQuestionsPerTurn] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [difficulties, setDifficulties] = useState(['facile', 'moyen', 'difficile']);

  const toggleCategory = (key) => {
    if (key === 'all') { setSelectedCategories(['all']); return; }
    const next = selectedCategories.filter(c => c !== 'all');
    setSelectedCategories(next.includes(key) ? next.filter(c => c !== key) : [...next, key]);
  };

  const toggleDifficulty = (key) => {
    setDifficulties(prev =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter(d => d !== key) : prev) : [...prev, key]
    );
  };

  const handleStart = () => {
    const teams = Array.from({ length: teamCount }, (_, i) => ({
      id: i,
      name: teamNames[i] || `Équipe ${i + 1}`,
      score: 0,
      color: TEAM_COLORS[i],
      correct: 0,
      wrong: 0,
    }));
    onStart({ teams, questionsPerTurn, selectedCategories, difficulties });
  };

  return (
    <div className="quiz-setup">
      <div className="quiz-hero">
        <span className="quiz-hero-icon">🏀</span>
        <h1>Basketball Trivia Quiz</h1>
        <p>Testez vos connaissances : NBA, NCAA, France, EuroLeague</p>
      </div>

      <div className="setup-grid">
        {/* Teams */}
        <div className="setup-card">
          <h2>👥 Équipes</h2>
          <div className="team-count-selector">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                className={`count-btn ${teamCount === n ? 'active' : ''}`}
                onClick={() => setTeamCount(n)}
              >
                {n} équipes
              </button>
            ))}
          </div>
          <div className="team-names">
            {Array.from({ length: teamCount }, (_, i) => (
              <div key={i} className="team-input-row">
                <span className="team-color-dot" style={{ background: TEAM_COLORS[i] }} />
                <input
                  className="team-input"
                  value={teamNames[i]}
                  onChange={e => {
                    const n = [...teamNames];
                    n[i] = e.target.value;
                    setTeamNames(n);
                  }}
                  placeholder={`Équipe ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Questions per turn */}
        <div className="setup-card">
          <h2>❓ Questions par manche</h2>
          <div className="qpt-selector">
            {[3, 5, 7, 10].map(n => (
              <button
                key={n}
                className={`count-btn ${questionsPerTurn === n ? 'active' : ''}`}
                onClick={() => setQuestionsPerTurn(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <h2 style={{ marginTop: '1.5rem' }}>📊 Niveaux de difficulté</h2>
          <div className="difficulty-toggles">
            {DIFFICULTIES.map(d => (
              <button
                key={d.key}
                className={`diff-toggle ${difficulties.includes(d.key) ? 'active' : ''}`}
                style={difficulties.includes(d.key) ? { borderColor: d.color, background: d.color + '22' } : {}}
                onClick={() => toggleDifficulty(d.key)}
              >
                {d.icon} {d.label} <span className="pts">+{d.points}pts</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="setup-card full-width">
          <h2>🏆 Catégories</h2>
          <div className="category-toggles">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`cat-toggle ${selectedCategories.includes(c.key) ? 'active' : ''}`}
                onClick={() => toggleCategory(c.key)}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="start-btn" onClick={handleStart}>
        🚀 Démarrer le Quiz
      </button>
    </div>
  );
}

// ─── Game screen ──────────────────────────────────────────────────────────────
function GameScreen({ config, onEnd }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [teams, setTeams] = useState(config.teams);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [phase, setPhase] = useState('question'); // 'question' | 'transition'
  const [roundScores, setRoundScores] = useState([]);
  const [usedIds, setUsedIds] = useState(new Set());

  const fetchQuestions = useCallback(async (cats, diffs, count) => {
    try {
      const params = new URLSearchParams();
      if (count) params.append('limit', count);
      const res = await axios.get(`/api/trivia/questions?${params}`);
      let pool = res.data;
      if (!cats.includes('all')) pool = pool.filter(q => cats.includes(q.category));
      pool = pool.filter(q => diffs.includes(q.difficulty));
      pool.sort(() => Math.random() - 0.5);
      return pool;
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const pool = await fetchQuestions(
        config.selectedCategories,
        config.difficulties,
        config.questionsPerTurn * config.teams.length * 3
      );
      setQuestions(pool);
      setLoading(false);
    };
    load();
  }, [config, fetchQuestions]);

  // Pick next unplayed question
  const nextQuestion = useCallback((currentUsed) => {
    return questions.find(q => !currentUsed.has(q.id)) || null;
  }, [questions]);

  const currentQuestion = questions.filter(q => !usedIds.has(q.id))[0] || null;

  // Timer
  useEffect(() => {
    if (loading || revealed || phase !== 'question') return;
    if (timer <= 0) { handleReveal(null); return; }
    const t = setTimeout(() => setTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  });

  const handleReveal = (option) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    const q = currentQuestion;
    if (!q) return;
    const isCorrect = option === q.answer;
    setTeams(prev => prev.map((t, i) => i === currentTeamIdx ? {
      ...t,
      score: t.score + (isCorrect ? q.points : 0),
      correct: t.correct + (isCorrect ? 1 : 0),
      wrong: t.wrong + (isCorrect ? 0 : 1),
    } : t));
    setRoundScores(prev => [...prev, { teamId: currentTeamIdx, correct: isCorrect, points: isCorrect ? q.points : 0 }]);
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    const newUsed = new Set(usedIds);
    newUsed.add(currentQuestion.id);
    setUsedIds(newUsed);
    setSelected(null);
    setRevealed(false);
    setTimer(TIMER_SECONDS);

    const nextQIdx = currentQIdx + 1;
    if (nextQIdx >= config.questionsPerTurn) {
      // next team
      const nextTeam = (currentTeamIdx + 1) % teams.length;
      if (nextTeam === 0 && currentTeamIdx === teams.length - 1) {
        // all teams done one round — check if more questions
        const remaining = questions.filter(q => !newUsed.has(q.id));
        if (remaining.length < teams.length) {
          onEnd(teams);
          return;
        }
      }
      setPhase('transition');
      setCurrentTeamIdx(nextTeam);
      setCurrentQIdx(0);
    } else {
      setCurrentQIdx(nextQIdx);
    }
  };

  const handleTransitionDone = () => setPhase('question');

  if (loading) return (
    <div className="quiz-loading">
      <div className="spinner" />
      <p>Chargement des questions…</p>
    </div>
  );

  if (!currentQuestion && !loading) {
    onEnd(teams);
    return null;
  }

  if (phase === 'transition') {
    return (
      <TransitionScreen
        team={teams[currentTeamIdx]}
        questionNumber={1}
        total={config.questionsPerTurn}
        onReady={handleTransitionDone}
      />
    );
  }

  const q = currentQuestion;
  const diff = DIFFICULTIES.find(d => d.key === q.difficulty);
  const cat = CATEGORIES.find(c => c.key === q.category);
  const timerPct = (timer / TIMER_SECONDS) * 100;

  return (
    <div className="quiz-game">
      {/* Scoreboard */}
      <div className="scoreboard">
        {teams.map((t, i) => (
          <div key={t.id} className={`score-chip ${i === currentTeamIdx ? 'active' : ''}`}
               style={{ borderColor: t.color }}>
            <span className="score-chip-name" style={{ color: t.color }}>{t.name}</span>
            <span className="score-chip-pts">{t.score} pts</span>
          </div>
        ))}
      </div>

      {/* Question card */}
      <div className="question-card">
        <div className="question-meta">
          <span className="cat-badge">{cat?.icon} {q.category}</span>
          <span className="diff-badge" style={{ background: diff?.color }}>{diff?.icon} {diff?.label}</span>
          <span className="pts-badge">+{q.points} pts</span>
          <span className="q-counter">{currentQIdx + 1}/{config.questionsPerTurn}</span>
        </div>

        <div className="current-team-label" style={{ color: teams[currentTeamIdx].color }}>
          🏀 {teams[currentTeamIdx].name} joue
        </div>

        {/* Timer bar */}
        <div className="timer-bar-wrap">
          <div className="timer-bar" style={{
            width: `${timerPct}%`,
            background: timer > 10 ? '#27ae60' : '#e74c3c',
          }} />
          <span className="timer-text">{timer}s</span>
        </div>

        <p className="question-text">{q.question}</p>

        <div className="options-grid">
          {q.options.map(opt => {
            let cls = 'option-btn';
            if (revealed) {
              if (opt === q.answer) cls += ' correct';
              else if (opt === selected) cls += ' wrong';
              else cls += ' dimmed';
            }
            return (
              <button key={opt} className={cls} onClick={() => handleReveal(opt)} disabled={revealed}>
                {opt}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className={`feedback ${selected === q.answer ? 'feedback-correct' : 'feedback-wrong'}`}>
            {selected === q.answer
              ? `✅ Bonne réponse ! +${q.points} points pour ${teams[currentTeamIdx].name}`
              : `❌ Mauvaise réponse. La bonne réponse était : ${q.answer}`}
            <button className="next-btn" onClick={handleNext}>
              {currentQIdx + 1 >= config.questionsPerTurn && currentTeamIdx < teams.length - 1
                ? `Passer à ${teams[(currentTeamIdx + 1) % teams.length].name} ➡️`
                : currentQIdx + 1 >= config.questionsPerTurn
                ? 'Voir les résultats 🏆'
                : 'Question suivante ➡️'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Transition screen ────────────────────────────────────────────────────────
function TransitionScreen({ team, questionNumber, total, onReady }) {
  return (
    <div className="transition-screen" style={{ borderColor: team.color }}>
      <div className="transition-icon">🏀</div>
      <h2 style={{ color: team.color }}>C'est au tour de</h2>
      <h1 style={{ color: team.color }}>{team.name}</h1>
      <p>{total} questions vous attendent !</p>
      <div className="team-score-display">Score actuel : <strong>{team.score} pts</strong></div>
      <button className="ready-btn" style={{ background: team.color }} onClick={onReady}>
        Nous sommes prêts ! 🚀
      </button>
    </div>
  );
}

// ─── Results screen ───────────────────────────────────────────────────────────
function ResultsScreen({ teams, onRestart }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const medals = ['🥇', '🥈', '🥉', '4️⃣'];

  return (
    <div className="results-screen">
      <div className="results-hero">
        <span className="trophy">🏆</span>
        <h1>Fin du Quiz !</h1>
        <p className="winner-announce" style={{ color: winner.color }}>
          🎉 {winner.name} remporte la victoire avec {winner.score} points !
        </p>
      </div>

      <div className="podium">
        {sorted.map((t, i) => (
          <div key={t.id} className="podium-card" style={{ borderColor: t.color }}>
            <span className="medal">{medals[i] || (i + 1)}</span>
            <div className="podium-name" style={{ color: t.color }}>{t.name}</div>
            <div className="podium-score">{t.score} pts</div>
            <div className="podium-stats">
              <span className="stat-correct">✅ {t.correct}</span>
              <span className="stat-wrong">❌ {t.wrong}</span>
            </div>
            {t.correct + t.wrong > 0 && (
              <div className="accuracy">
                {Math.round((t.correct / (t.correct + t.wrong)) * 100)}% de réussite
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="restart-btn" onClick={onRestart}>
        🔄 Rejouer
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TriviaQuiz() {
  const [screen, setScreen] = useState('setup'); // 'setup' | 'game' | 'results'
  const [config, setConfig] = useState(null);
  const [finalTeams, setFinalTeams] = useState([]);

  const handleStart = (cfg) => { setConfig(cfg); setScreen('game'); };
  const handleEnd = (teams) => { setFinalTeams(teams); setScreen('results'); };
  const handleRestart = () => { setConfig(null); setScreen('setup'); };

  if (screen === 'setup') return <SetupScreen onStart={handleStart} />;
  if (screen === 'game') return <GameScreen config={config} onEnd={handleEnd} />;
  if (screen === 'results') return <ResultsScreen teams={finalTeams} onRestart={handleRestart} />;
  return null;
}
