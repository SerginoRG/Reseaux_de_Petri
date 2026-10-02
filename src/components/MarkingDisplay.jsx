import React from 'react';
import Place from './Place';
import { places } from '../data/petriNet';

/**
 * Composant MarkingDisplay — affiche le marquage actuel sous forme de cartes.
 */
export default function MarkingDisplay({ marking }) {
  return (
    <section className="section marking-display" id="marking-display">
      <h2 className="section__title">État actuel du réseau</h2>
      <p className="marking-display__formula">
        M = ({marking.join(', ')})
      </p>
      <div className="marking-display__grid">
        {places.map((place, index) => (
          <Place
            key={place.id}
            id={place.id}
            label={place.shortLabel}
            tokens={marking[index]}
            icon={place.icon}
            isActive={marking[index] > 0}
          />
        ))}
      </div>
    </section>
  );
}
