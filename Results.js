// src/components/Results.js

import React from 'react';
import './Quiz.css'; // Asigură-te că acest path este corect

export default function Results({ score, details, totalQuestions, onRestart }) {
  if (!details || details.length === 0) {
    return <h2>Nu s-au înregistrat rezultate.</h2>;
  }

  return (
    <div className="rezultate-container">
      {/* Secțiunea de Scor General */}
      <div className="scor-header">
        <h1>🏆 Rezultate</h1>
        <p>Scor final: <span className="final-score">{score} / {totalQuestions}</span></p>
        <button className="restart-btn" onClick={onRestart}>Începe un nou Quiz</button>
      </div>

      <hr />

      {/* Lista Detaliată de Răspunsuri */}
      <div className="rezultate-lista">
        {details.map((item, index) => {
          // Determinăm clasa CSS pentru răspunsul utilizatorului
          const clasaCuloare = item.correct ? 'raspuns-corect' : 'raspuns-gresit';

          return (
            <div key={index} className="rezultat-item">
              {/* Numele Țării */}
              <h3>{index + 1}. {item.country}</h3>
              
              {/* Răspunsul Utilizatorului */}
              <p>
                Răspunsul tău: <span className={clasaCuloare}>**{item.userAnswer || 'Fără Răspuns'}**</span>
              </p>
              
              {/* Răspunsul Corect (afișat condiționat) */}
              {item.correct ? (
                // Când e corect, arătăm doar bifa
                <p className="raspuns-oficial corect-green">✅ Corect</p>
              ) : (
                // Când e greșit, arătăm răspunsul corect
                <p className="raspuns-oficial gresit-red">
                  ❌ Corect: **{item.correctAnswer}**
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      <button className="restart-btn bottom-btn" onClick={onRestart}>Înapoi la continente</button>
    </div>
  );
}