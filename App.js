import React, { useState, useEffect } from "react";
import Quiz from "./Quiz";

import countries from "./data/countries";
import "./index.css"; 

export default function App() {
  const [continent, setContinent] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [savedScores, setSavedScores] = useState({});
  const [learningMode, setLearningMode] = useState(false);
  const [quickPlay, setQuickPlay] = useState(false);
  
  // Stare pentru cercurile întoarse
  const [flippedCards, setFlippedCards] = useState({}); 

  useEffect(() => {
    const stored = localStorage.getItem("quizScores");
    if (stored) setSavedScores(JSON.parse(stored));
  }, []);

  const saveScore = (continentName, score, total) => {
    const newScores = {
      ...savedScores,
      [continentName]: { score, total },
    };
    setSavedScores(newScores);
    localStorage.setItem("quizScores", JSON.stringify(newScores));
  };

  const startQuiz = (selected, quick = false) => {
    setContinent(selected);
    setScoreData(null);
    setLearningMode(false);
    setQuickPlay(quick);
    setFlippedCards({}); 
  };

  const finishQuiz = (result) => {
    saveScore(continent, result.score, result.details.length);
    setScoreData(result);
  };

  const quitQuiz = () => {
    setContinent(null);
    setScoreData(null);
    setLearningMode(false);
    setQuickPlay(false);
    setFlippedCards({});
  };

  const allCountries = Object.values(countries).flat();

  // Funcție flip
  const toggleFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // 🔵🔵🔵 MODUL DE ÎNVĂȚARE CU CERCURI 🔵🔵🔵
  if (learningMode && continent) {
    const data =
      continent === "Toate capitalele" ? allCountries : countries[continent];
    
    return (
      <div className="learning-container">
        
        <div className="learning-header">
          <button className="back-btn-simple" onClick={quitQuiz}>
            ⬅️ Înapoi
          </button>
          <h1 className="learning-title">
             {continent}
          </h1>
          <p>Apasă pe cerc pentru a vedea capitala!</p>
        </div>

        {/* GRILA DE CERCURI */}
        <div className="circles-grid">
          {data.map((item, i) => (
            <div 
              key={i} 
              className={`circle-card ${flippedCards[i] ? 'flipped' : ''}`}
              onClick={() => toggleFlip(i)}
            >
              <div className="circle-inner">
                
                {/* Fața (Verde) - Țara */}
                <div className="circle-face circle-front">
                  <span className="circle-label">Țara</span>
                  <span className="circle-text">{item.country}</span>
                  <div className="rotate-icon">🔄</div>
                </div>

                {/* Spatele (Albastru) - Capitala */}
                <div className="circle-face circle-back">
                  <span className="circle-label">Capitala</span>
                  <span className="circle-text">{item.capital}</span>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // --- RESTUL APLICAȚIEI (DASHBOARD & QUIZ) ---
  if (!continent && !scoreData) {
    const continentData = [
      { name: "Europa", emoji: "🌍", count: countries.Europa.length },
      { name: "Asia", emoji: "🌏", count: countries.Asia.length },
      { name: "Africa", emoji: "🌍", count: countries.Africa.length },
      { name: "America de Nord", emoji: "🌎", count: countries["America de Nord"].length },
      { name: "America de Sud", emoji: "🌎", count: countries["America de Sud"].length },
      { name: "Oceania", emoji: "🌊", count: countries.Oceania.length },
      { name: "Toate capitalele", emoji: "🌎", count: allCountries.length },
    ];

    const getProgressColor = (continentName) => {
      const data = savedScores[continentName];
      if (!data) return "#f3f4f6"; 
      const ratio = data.score / data.total;
      if (ratio === 1) return "#16a34a"; 
      if (ratio >= 0.5) return "#facc15"; 
      return "#ef4444"; 
    };

    const getBadge = (continentName) => {
      const data = savedScores[continentName];
      if (!data) return null;
      const ratio = data.score / data.total;
      if (ratio === 1) return "🥇 Aur";
      if (ratio >= 0.8) return "🥈 Argint";
      if (ratio >= 0.5) return "🥉 Bronz";
      return null;
    };

    return (
      <div className="continent-container">
        <h1 className="main-title">🌍 Capital Quiz World</h1>
        <p className="subtitle">Alege un continent pentru a începe aventura!</p>

        <div className="continent-grid">
          {continentData.map((c) => {
            const data = savedScores[c.name];
            const scoreText = data ? `Scor: ${data.score}/${data.total}` : "Neînceput";
            const badge = getBadge(c.name);

            return (
              <div key={c.name} className="continent-card" style={{ borderTop: `6px solid ${getProgressColor(c.name)}` }}>
                <div className="continent-emoji">{c.emoji}</div>
                <h2>{c.name}</h2>
                <p>{c.count} capitale</p>
                <p className="score-text">{scoreText}</p>
                {badge && <p className="badge">{badge}</p>}
                <div className="button-row">
                  <button className="learn-btn" onClick={() => { setLearningMode(true); setContinent(c.name); }}>📘 Învață</button>
                  <button className="quiz-btn" onClick={() => startQuiz(c.name)}>🎯 Quiz</button>
                  <button className="quick-btn" onClick={() => startQuiz(c.name, true)}>⚡ Quick Play</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (scoreData) {
    return (
      <div className="result">
        <h1>🏆 Rezultate</h1>
        <h2>Scor: {scoreData.score} / {continent === "Toate capitalele" ? allCountries.length : countries[continent].length}</h2>
        <div className="answer-list">
          {scoreData.details.map((a, i) => (
            <div key={i} className={`answer-item ${a.correct ? "correct" : "wrong"}`}>
              <strong>{i + 1}. {a.country}</strong>
              <p>Răspunsul tău: <b style={{ color: a.correct ? "#16a34a" : "#dc2626" }}>{a.userAnswer || "Nerăspuns"}</b></p>
              {!a.correct && <p>✅ Corect: <b>{a.correctAnswer}</b></p>}
            </div>
          ))}
        </div>
        <button className="back-btn" onClick={quitQuiz}>⬅️ Înapoi la continente</button>
      </div>
    );
  }

  const fullData = continent === "Toate capitalele" ? allCountries : countries[continent];
  const data = quickPlay ? fullData.sort(() => Math.random() - 0.5).slice(0, 10) : fullData;

  return <Quiz data={data} onFinish={finishQuiz} onQuit={quitQuiz} timer={10} />;
}