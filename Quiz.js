import React, { useState, useEffect } from "react";
import "./Quiz.css";

export default function Quiz({ data, onFinish, onQuit, timer }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [answers, setAnswers] = useState([]);
  const [options, setOptions] = useState([]);

  // nou:
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const current = data[index];
    if (current) {
      generateOptions(current.capital);
      setTimeLeft(timer);
      setSelectedAnswer(null);
      setIsLocked(false);
    }
  }, [index]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const countdown = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timeLeft]);

  const generateOptions = (correctAnswer) => {
    const otherOptions = data
      .map((q) => q.capital)
      .filter((cap) => cap !== correctAnswer);
    const random = otherOptions.sort(() => Math.random() - 0.5).slice(0, 3);
    setOptions([correctAnswer, ...random].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (selected) => {
    if (isLocked) return; // blochează spam-click

    const current = data[index];
    const isCorrect = selected === current.capital;

    setSelectedAnswer(selected);
    setIsLocked(true);

    if (isCorrect) setScore((prev) => prev + 1);

    const newAnswer = {
      country: current.country,
      userAnswer: selected,
      correctAnswer: current.capital,
      correct: isCorrect,
    };
    setAnswers((prev) => [...prev, newAnswer]);

    // trece automat după 1 secundă
    setTimeout(() => {
      if (index + 1 < data.length) {
        setIndex(index + 1);
      } else {
        onFinish({
          score: isCorrect ? score + 1 : score,
          details: [...answers, newAnswer],
        });
      }
    }, 1000);
  };

  const current = data[index];
  if (!current) return null;

  return (
    <div className="quiz-page">
      <div className="quiz-card">

        {/* TIMER ROTUND */}
        <div className="timer-wrapper">
          <div className="timer-circle">
            <svg>
              <circle cx="45" cy="45" r="40"></circle>
              <circle
                cx="45"
                cy="45"
                r="40"
                style={{
                  animation: `countdown ${timer}s linear forwards`,
                  strokeDashoffset: (1 - timeLeft / timer) * 251,
                }}
              ></circle>
            </svg>
            <span className="timer-text">{timeLeft}s</span>
          </div>
        </div>

        {/* ÎNTREBARE */}
        <h2 className="quiz-question">
          Care este capitala {current.country}?
        </h2>

        {/* OPȚIUNI */}
        <div className="options-grid">
          {options.map((opt, i) => {
            let extraClass = "";

            if (selectedAnswer) {
              if (opt === current.capital) extraClass = "correct";
              else if (opt === selectedAnswer) extraClass = "wrong";
              else extraClass = "disabled";
            }

            return (
              <div
                key={i}
                className={`option-card ${extraClass}`}
                onClick={() => handleAnswer(opt)}
              >
                <span className="option-icon">🌍</span>
                <p>{opt}</p>
              </div>
            );
          })}
        </div>

        {/* INFO */}
        <div className="quiz-stats">
          <p>Întrebarea {index + 1} / {data.length}</p>
          <p>🏆 Scor: {score}</p>
        </div>

        {/* BUTON RENUNȚARE */}
        <button className="quit-btn" onClick={onQuit}>
          Renunță la quiz
        </button>
      </div>
    </div>
  );
}
