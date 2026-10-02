import React from 'react';
import { Pre, Post, W, places, transitions } from '../data/petriNet';

/**
 * Composant MatrixDisplay — affiche les matrices Pre, Post et W.
 */
export default function MatrixDisplay() {
  const renderMatrix = (matrix, title) => (
    <div className="matrix-block">
      <h3 className="matrix-block__title">{title}</h3>
      <div className="table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th></th>
              {transitions.map((t) => (
                <th key={t.id}>{t.id}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={places[i].id}>
                <td className="matrix-table__label">{places[i].id}</td>
                {row.map((val, j) => (
                  <td
                    key={j}
                    className={
                      val > 0
                        ? 'matrix-table__positive'
                        : val < 0
                        ? 'matrix-table__negative'
                        : 'matrix-table__zero'
                    }
                  >
                    {val > 0 ? `+${val}` : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <section className="section matrix-display" id="matrix-display">
      <h2 className="section__title">Formule du réseau de Pétri</h2>

      <div className="formula-box">
        <p className="formula-box__equation">
          M<sub>k</sub> = M<sub>i</sub> + W × S
        </p>
        <p className="formula-box__description">
          Où <strong>M<sub>i</sub></strong> est le marquage actuel, <strong>W</strong> la matrice
          d'incidence et <strong>S</strong> le vecteur de tir.
        </p>
      </div>

      <div className="matrix-display__grid">
        {renderMatrix(Pre, 'Matrice Pre')}
        {renderMatrix(Post, 'Matrice Post')}
        {renderMatrix(W, 'Matrice d\'incidence W = Post − Pre')}
      </div>

      <div className="property-box" id="system-property">
        <h3 className="property-box__title">Propriété du système</h3>
        <p className="property-box__equation">
          M(P2) + M(P3) + M(P4) = 1
        </p>
        <p className="property-box__description">
          Le caissier est toujours dans <strong>un seul état</strong> :
        </p>
        <ul className="property-box__list">
          <li>🟢 Libre (P2)</li>
          <li>💳 Paiement en cours (P3)</li>
          <li>✅ Paiement validé – remise du reçu (P4)</li>
        </ul>
        <div className="alert alert--warning">
          <span className="alert__icon">⚠️</span>
          <p>
            <strong>Attention :</strong> la file d'attente P1 peut augmenter si les clients
            arrivent plus rapidement que le caissier ne les traite.
          </p>
        </div>
      </div>
    </section>
  );
}
