import React from 'react';

/**
 * Composant Place — affiche une place du réseau avec ses jetons.
 */
export default function Place({ id, label, tokens, icon, isActive }) {
  const renderTokens = () => {
    if (tokens === 0) return <span className="no-tokens">Aucun</span>;

    const dots = [];
    const displayCount = Math.min(tokens, 8);
    for (let i = 0; i < displayCount; i++) {
      dots.push(<span key={i} className="token-dot" />);
    }
    if (tokens > 8) {
      dots.push(
        <span key="more" className="token-more">
          +{tokens - 8}
        </span>
      );
    }
    return dots;
  };

  return (
    <div className={`place-card ${isActive ? 'place-card--active' : ''}`}>
      <div className="place-card__header">
        <span className="place-card__icon">{icon}</span>
        <span className="place-card__id">{id}</span>
      </div>
      <div className="place-card__label">{label}</div>
      <div className="place-card__tokens-section">
        <span className="place-card__token-count">{tokens}</span>
        <span className="place-card__token-label">jeton{tokens !== 1 ? 's' : ''}</span>
      </div>
      <div className="place-card__tokens">{renderTokens()}</div>
    </div>
  );
}
