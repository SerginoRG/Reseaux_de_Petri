import React from 'react';

/**
 * Composant SimulationHistory — affiche le tableau récapitulatif de la simulation.
 */
export default function SimulationHistory({ history, error }) {
  if (history.length === 0 && !error) return null;

  const last = history.length > 0 ? history[history.length - 1] : null;

  return (
    <section className="section simulation-history" id="simulation-history">
      <h2 className="section__title">Résultat de la simulation</h2>

      {error && (
        <div className="alert alert--error" role="alert">
          <span className="alert__icon">⚠️</span>
          <div className="alert__body">
            {error.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <>
          <div className="table-wrapper">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>Étape</th>
                  <th>Transition</th>
                  <th>P1</th>
                  <th>P2</th>
                  <th>P3</th>
                  <th>P4</th>
                  <th>P5</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.step} className={row.step === 0 ? 'sim-table__initial' : ''}>
                    <td>{row.step}</td>
                    <td>
                      <span className={row.step === 0 ? 'tag tag--neutral' : 'tag tag--transition'}>
                        {row.transition}
                      </span>
                    </td>
                    {row.marking.map((val, idx) => (
                      <td key={idx} className={val > 0 ? 'sim-table__active' : ''}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {last && (
            <div className="simulation-history__final">
              <strong>Marquage final :</strong> M{last.step} = ({last.marking.join(', ')})
            </div>
          )}
        </>
      )}
    </section>
  );
}
