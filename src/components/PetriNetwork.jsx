import React from 'react';

/**
 * Composant PetriNetwork — représentation graphique SVG du réseau de Pétri.
 * 
 * Layout :
 *   T1 → P1 → T2 → P3 → T3 → P4 → T4 → P5
 *               ↑                        ↓
 *              P2  ← ← ← ← ← ← ← ← ← ←
 */
export default function PetriNetwork({ marking }) {
  // Positions des places (circle)
  const placePositions = {
    P1: { x: 200, y: 100 },
    P2: { x: 200, y: 260 },
    P3: { x: 440, y: 100 },
    P4: { x: 620, y: 100 },
    P5: { x: 800, y: 100 },
  };

  // Positions des transitions (rect)
  const transPositions = {
    T1: { x: 80, y: 100 },
    T2: { x: 320, y: 100 },
    T3: { x: 530, y: 100 },
    T4: { x: 710, y: 100 },
  };

  const placeRadius = 32;
  const transW = 14;
  const transH = 50;

  // Arcs (flèches)
  const arcs = [
    // T1 → P1
    { from: transPositions.T1, to: placePositions.P1, type: 'trans-to-place' },
    // P1 → T2
    { from: placePositions.P1, to: transPositions.T2, type: 'place-to-trans' },
    // P2 → T2
    { from: placePositions.P2, to: transPositions.T2, type: 'place-to-trans', curved: true, label: '' },
    // T2 → P3
    { from: transPositions.T2, to: placePositions.P3, type: 'trans-to-place' },
    // P3 → T3
    { from: placePositions.P3, to: transPositions.T3, type: 'place-to-trans' },
    // T3 → P4
    { from: transPositions.T3, to: placePositions.P4, type: 'trans-to-place' },
    // P4 → T4
    { from: placePositions.P4, to: transPositions.T4, type: 'place-to-trans' },
    // T4 → P5
    { from: transPositions.T4, to: placePositions.P5, type: 'trans-to-place' },
    // T4 → P2 (return arc, curved below)
    { from: transPositions.T4, to: placePositions.P2, type: 'trans-to-place', curved: true, returnArc: true },
  ];

  const placeLabels = {
    P1: 'Clients en file',
    P2: 'Caissier libre',
    P3: 'Paiement en cours',
    P4: 'Paiement validé',
    P5: 'Clients repartis',
  };

  const transLabels = {
    T1: 'Arrivée',
    T2: 'Début paiement',
    T3: 'Validation',
    T4: 'Remise reçu',
  };

  const placeColors = {
    P1: '#6366f1',
    P2: '#10b981',
    P3: '#f59e0b',
    P4: '#8b5cf6',
    P5: '#06b6d4',
  };

  const renderTokens = (cx, cy, count) => {
    if (count === 0) return null;
    if (count === 1) {
      return <circle cx={cx} cy={cy} r={7} fill="#1e293b" stroke="#fff" strokeWidth={1.5} />;
    }
    if (count === 2) {
      return (
        <>
          <circle cx={cx - 8} cy={cy} r={6} fill="#1e293b" stroke="#fff" strokeWidth={1.5} />
          <circle cx={cx + 8} cy={cy} r={6} fill="#1e293b" stroke="#fff" strokeWidth={1.5} />
        </>
      );
    }
    if (count === 3) {
      return (
        <>
          <circle cx={cx} cy={cy - 8} r={5.5} fill="#1e293b" stroke="#fff" strokeWidth={1.5} />
          <circle cx={cx - 8} cy={cy + 6} r={5.5} fill="#1e293b" stroke="#fff" strokeWidth={1.5} />
          <circle cx={cx + 8} cy={cy + 6} r={5.5} fill="#1e293b" stroke="#fff" strokeWidth={1.5} />
        </>
      );
    }
    // 4+ : show number
    return (
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#1e293b" fontWeight="bold" fontSize="16">
        {count}
      </text>
    );
  };

  const renderArrow = (arc, idx) => {
    const { from, to, curved, returnArc } = arc;

    if (returnArc) {
      // T4 → P2 : curved arc going below
      const path = `M ${to.x + transW / 2 + 10},${to.y + transH / 2}
                     Q ${(from.x + to.x) / 2},${to.y + 80}
                     ${from.x},${from.y + transH / 2}`;
      return (
        <g key={idx}>
          <path d={path} fill="none" stroke="#94a3b8" strokeWidth={2} markerEnd="url(#arrowReverse)" />
        </g>
      );
    }

    if (curved) {
      // P2 → T2 : curved arc going up
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2 + 30;
      const path = `M ${from.x + placeRadius},${from.y - placeRadius / 2}
                     Q ${midX + 30},${midY - 60}
                     ${to.x},${to.y + transH / 2}`;
      return (
        <g key={idx}>
          <path d={path} fill="none" stroke="#94a3b8" strokeWidth={2} markerEnd="url(#arrow)" />
        </g>
      );
    }

    // Straight horizontal arrow
    const startX = arc.type === 'place-to-trans' ? from.x + placeRadius + 2 : from.x + transW + 2;
    const endX = arc.type === 'place-to-trans' ? to.x - 2 : to.x - placeRadius - 2;
    const y = from.y;

    return (
      <g key={idx}>
        <line x1={startX} y1={y} x2={endX} y2={y} stroke="#94a3b8" strokeWidth={2} markerEnd="url(#arrow)" />
      </g>
    );
  };

  // Incoming arrow for T1 (external arrival)
  const arrivalArrow = (
    <g>
      <line x1={20} y1={100} x2={transPositions.T1.x - 2} y2={100} stroke="#94a3b8" strokeWidth={2} markerEnd="url(#arrow)" strokeDasharray="6 3" />
      <text x={10} y={85} fontSize="11" fill="#94a3b8" fontStyle="italic">Arrivée</text>
    </g>
  );

  return (
    <section className="section petri-network" id="petri-network">
      <h2 className="section__title">Représentation graphique du réseau</h2>
      <div className="petri-network__svg-wrapper">
        <svg viewBox="0 0 880 340" className="petri-network__svg" aria-label="Réseau de Pétri">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker id="arrowReverse" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 10 0 L 0 5 L 10 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Arcs */}
          {arrivalArrow}
          {arcs.map(renderArrow)}

          {/* Transitions (rectangles) */}
          {Object.entries(transPositions).map(([id, pos]) => (
            <g key={id}>
              <rect
                x={pos.x - transW / 2}
                y={pos.y - transH / 2}
                width={transW}
                height={transH}
                rx={3}
                fill="#334155"
                stroke="#64748b"
                strokeWidth={2}
              />
              <text x={pos.x} y={pos.y - transH / 2 - 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#e2e8f0">
                {id}
              </text>
              <text x={pos.x} y={pos.y + transH / 2 + 18} textAnchor="middle" fontSize="10" fill="#94a3b8">
                {transLabels[id]}
              </text>
            </g>
          ))}

          {/* Places (circles) */}
          {Object.entries(placePositions).map(([id, pos]) => {
            const idx = parseInt(id.slice(1)) - 1;
            const tokens = marking[idx];
            return (
              <g key={id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={placeRadius}
                  fill={tokens > 0 ? placeColors[id] : '#1e293b'}
                  stroke={placeColors[id]}
                  strokeWidth={3}
                  opacity={tokens > 0 ? 1 : 0.6}
                />
                {renderTokens(pos.x, pos.y, tokens)}
                <text x={pos.x} y={pos.y - placeRadius - 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#e2e8f0">
                  {id}
                </text>
                <text x={pos.x} y={pos.y + placeRadius + 20} textAnchor="middle" fontSize="10" fill="#94a3b8">
                  {placeLabels[id]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
