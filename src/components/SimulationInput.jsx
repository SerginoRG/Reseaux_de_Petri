import React, { useState } from 'react';

/**
 * Composant SimulationInput — zone de saisie d'une séquence de transitions.
 */
export default function SimulationInput({ onSimulate }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSimulate(input.trim());
    }
  };

  return (
    <section className="section simulation-input" id="simulation-input">
      <h2 className="section__title">Saisie d'une séquence</h2>
      <form className="simulation-input__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="simulation-input__field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex : T1, T1, T2, T3, T4"
          aria-label="Séquence de transitions"
        />
        <button type="submit" className="btn btn--primary" id="btn-simulate">
          Simuler
        </button>
      </form>
      <p className="simulation-input__hint">
        Séparez les transitions par des virgules. Exemple : <code>T1,T1,T2,T3,T4</code>
      </p>
    </section>
  );
}
