// src/components/ContinentSelect.js
import React from 'react';
import './ContinentSelect.css'; 
// Dacă nu ai instalat 'react-icons', șterge importul de mai jos și scoate <FaArrowLeft /> din cod
import { FaArrowLeft, FaGlobeAmericas } from 'react-icons/fa'; 

const ContinentSelect = ({ data, onBack, continentName }) => {
  // continentName ar fi de ex: "Europa", "Asia". Dacă nu îl ai în props, poți să îl scoți.

  return (
    <div className="learning-container">
      
      {/* --- Header-ul Paginii --- */}
      <div className="header-section">
        <button className="back-btn" onClick={onBack}>
          {/* Dacă ai react-icons */}
          <FaArrowLeft /> 
          <span>Înapoi</span>
        </button>
        
        <h1 className="page-title">
          {/* Poți pune un icon aici dacă vrei */}
          Învață Capitalele
        </h1>
      </div>

      {/* --- Zona de Cartonașe (Grid) --- */}
      <div className="cards-grid">
        {data.map((item, index) => (
          <div key={index} className="flashcard">
            
            {/* O bară colorată sus pentru stil */}
            <div className="card-top"></div>

            <div className="card-content">
              {/* Partea de sus: ȚARA */}
              <div>
                <div className="label">Țara</div>
                <div className="country-text">{item.tara}</div>
              </div>

              {/* Linie fină la mijloc */}
              <div className="divider"></div>

              {/* Partea de jos: CAPITALA */}
              <div>
                <div className="label">Capitala</div>
                <div className="capital-text">{item.capitala}</div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ContinentSelect;