import React, { useState, useCallback } from 'react';
import { initialMarking, transitions as transitionsData } from './data/petriNet';
import {
  isFireable,
  fireTransition,
  transitionIdToIndex,
  simulateSequence,
  parseSequenceInput,
} from './utils/petriSimulation';

import MarkingDisplay from './components/MarkingDisplay';
import PetriNetwork from './components/PetriNetwork';
import Transition from './components/Transition';
import SimulationInput from './components/SimulationInput';
import SimulationHistory from './components/SimulationHistory';
import MatrixDisplay from './components/MatrixDisplay';

import './App.css';

export default function App() {
  const [marking, setMarking] = useState([...initialMarking]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [flashMessage, setFlashMessage] = useState(null);

  // Affiche un message flash temporaire
  const showFlash = useCallback((message, type = 'error') => {
    setFlashMessage({ message, type });
    setTimeout(() => setFlashMessage(null), 4000);
  }, []);

  // Exécuter une seule transition (bouton rapide)
  const handleFireSingle = useCallback(
    (transId) => {
      const idx = transitionIdToIndex(transId);
      if (idx === null) return;

      const { fireable, reasons } = isFireable(marking, idx);
      if (!fireable) {
        showFlash(`${transId} n'est pas franchissable : ${reasons.join(' ')}`, 'error');
        return;
      }

      const newMarking = fireTransition(marking, idx);
      setMarking(newMarking);
      setHistory((prev) => [
        ...prev,
        ...(prev.length === 0
          ? [{ step: 0, transition: 'M0', marking: [...marking] }]
          : []),
        {
          step: (prev.length === 0 ? 1 : prev[prev.length - 1].step + 1),
          transition: transId,
          marking: [...newMarking],
        },
      ]);
      setError(null);
      showFlash(`${transId} exécutée avec succès ✓`, 'success');
    },
    [marking, showFlash]
  );

  // Simuler une séquence complète
  const handleSimulateSequence = useCallback(
    (input) => {
      const sequence = parseSequenceInput(input);
      if (sequence.length === 0) {
        showFlash('Veuillez saisir au moins une transition.', 'error');
        return;
      }

      const result = simulateSequence(marking, sequence);
      setHistory(result.history);

      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        const last = result.history[result.history.length - 1];
        setMarking([...last.marking]);
        showFlash(`Simulation terminée : ${sequence.length} transition(s) exécutée(s) ✓`, 'success');
      }
    },
    [marking, showFlash]
  );

  // Réinitialiser
  const handleReset = useCallback(() => {
    setMarking([...initialMarking]);
    setHistory([]);
    setError(null);
    setFlashMessage(null);
  }, []);

  // Vérifier si chaque transition est franchissable
  const fireability = transitionsData.map((_, idx) => isFireable(marking, idx).fireable);

  return (
    <div className="app">
      {/* En-tête */}
      <header className="app-header" id="app-header">
        <div className="app-header__content">
          <h1 className="app-header__title">Simulation d'un Réseau de Pétri</h1>
          <p className="app-header__subtitle">
            Paiement d'une facture d'eau ou d'électricité à un guichet
          </p>
        </div>
      </header>

      <main className="app-main">
        {/* Message flash */}
        {flashMessage && (
          <div className={`flash flash--${flashMessage.type}`} role="status">
            {flashMessage.message}
          </div>
        )}

        {/* Visualisation graphique */}
        <PetriNetwork marking={marking} />

        {/* État actuel */}
        <MarkingDisplay marking={marking} />

        {/* Boutons rapides */}
        <section className="section transitions-section" id="quick-transitions">
          <h2 className="section__title">Transitions rapides</h2>
          <div className="transitions-section__grid">
            {transitionsData.map((t, idx) => (
              <Transition
                key={t.id}
                id={t.id}
                label={t.shortLabel}
                fireable={fireability[idx]}
                onFire={handleFireSingle}
              />
            ))}
          </div>
          <div className="transitions-section__actions">
            <button className="btn btn--reset" onClick={handleReset} id="btn-reset">
              🔄 Réinitialiser
            </button>
          </div>
        </section>

        {/* Saisie de séquence */}
        <SimulationInput onSimulate={handleSimulateSequence} />

        {/* Historique */}
        <SimulationHistory history={history} error={error} />

        {/* Matrices et formule */}
        <MatrixDisplay />
      </main>

      <footer className="app-footer">
        <p>Projet universitaire — Réseau de Pétri — {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
