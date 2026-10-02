import React from 'react';

/**
 * Composant Transition — bouton rapide pour une transition.
 */
export default function Transition({ id, label, fireable, onFire }) {
  return (
    <button
      className={`transition-btn ${fireable ? 'transition-btn--enabled' : 'transition-btn--disabled'}`}
      onClick={() => onFire(id)}
      title={fireable ? `Exécuter ${id}` : `${id} n'est pas franchissable`}
    >
      <span className="transition-btn__id">{id}</span>
      <span className="transition-btn__label">{label}</span>
      {!fireable && <span className="transition-btn__lock">🔒</span>}
    </button>
  );
}
