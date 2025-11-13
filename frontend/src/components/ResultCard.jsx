// frontend/src/components/ResultCard.jsx
// Display verification result with color-coded status

import React from 'react';
import { STATUS_LABELS } from '../utils/constants';

const ResultCard = ({ score, status, hints = [] }) => {
  const statusClass = `status--${(status || '').toLowerCase()}`;
  const label = STATUS_LABELS[status] || status;

  return (
    <div className="result-card">
      <div className="result-card__score">
        <span className="result-card__score-label">Authenticity Score</span>
        <span className="result-card__score-value">{score}</span>
      </div>
      <div className="result-card__status">
        <span className="result-card__status-label">Status</span>
        <span className={`result-card__status-value ${statusClass}`}>{label}</span>
      </div>
      {hints && hints.length > 0 && (
        <div className="result-card__hints">
          <h4>Analysis Notes</h4>
          <ul>
            {hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
