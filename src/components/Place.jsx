import React from 'react';
import { FaUsers, FaUserTie, FaCreditCard, FaCheckCircle, FaReceipt } from 'react-icons/fa';

/**
 * Mapping des identifiants d'icônes vers les composants react-icons.
 */
const iconMap = {
  users: FaUsers,
  cashier: FaUserTie,
  payment: FaCreditCard,
  validated: FaCheckCircle,
  receipt: FaReceipt,
};

/**
 * Composant Place — affiche une place du réseau avec ses jetons.
 */
export default function Place({ id, label, tokens, icon, isActive }) {
  const IconComponent = iconMap[icon];

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
        <span className="place-card__icon">
          {IconComponent ? <IconComponent /> : null}
        </span>
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
