import { Pre, W, places, transitions, transitionErrorShort } from '../data/petriNet';

/**
 * Vérifie si une transition est franchissable dans un marquage donné.
 * @param {number[]} marking – Le marquage actuel.
 * @param {number} transitionIndex – L'index de la transition (0–3).
 * @returns {{ fireable: boolean, reasons: string[] }}
 */
export function isFireable(marking, transitionIndex) {
  const reasons = [];
  for (let i = 0; i < marking.length; i++) {
    if (marking[i] < Pre[i][transitionIndex]) {
      const placeId = places[i].id;
      const transId = transitions[transitionIndex].id;
      const shortErrors = transitionErrorShort[transId];
      if (shortErrors && shortErrors[placeId]) {
        reasons.push(shortErrors[placeId]);
      } else {
        reasons.push(`${placeId} (${places[i].label}) nécessite au moins ${Pre[i][transitionIndex]} jeton(s), mais n'en contient que ${marking[i]}.`);
      }
    }
  }
  return { fireable: reasons.length === 0, reasons };
}

/**
 * Exécute le tir d'une transition et retourne le nouveau marquage.
 * M_new = M_current + W × S  (S est le vecteur caractéristique de la transition)
 * @param {number[]} marking – Le marquage actuel.
 * @param {number} transitionIndex – L'index de la transition.
 * @returns {number[]} Le nouveau marquage.
 */
export function fireTransition(marking, transitionIndex) {
  return marking.map((m, i) => m + W[i][transitionIndex]);
}

/**
 * Convertit un identifiant de transition (ex. "T1") en index (0-based).
 * @param {string} id – L'identifiant (T1, T2, T3 ou T4).
 * @returns {number|null}
 */
export function transitionIdToIndex(id) {
  const idx = transitions.findIndex((t) => t.id === id.toUpperCase().trim());
  return idx >= 0 ? idx : null;
}

/**
 * Simule une séquence complète de transitions.
 * @param {number[]} startMarking – Le marquage de départ.
 * @param {string[]} sequence – La séquence de transitions (ex. ["T1","T2","T3"]).
 * @returns {{ history: Array<{ step: number, transition: string, marking: number[] }>, error: string|null }}
 */
export function simulateSequence(startMarking, sequence) {
  const history = [
    { step: 0, transition: 'M0', marking: [...startMarking] },
  ];

  let current = [...startMarking];

  for (let i = 0; i < sequence.length; i++) {
    const transId = sequence[i].toUpperCase().trim();
    const idx = transitionIdToIndex(transId);

    if (idx === null) {
      return {
        history,
        error: `"${sequence[i]}" n'est pas une transition valide. Utilisez T1, T2, T3 ou T4.`,
      };
    }

    const { fireable, reasons } = isFireable(current, idx);
    if (!fireable) {
      return {
        history,
        error: `Erreur à l'étape ${i + 1} : ${transId} n'est pas franchissable dans le marquage actuel (${current.join(',')}).\nRaison(s) : ${reasons.join(' ')}`,
      };
    }

    current = fireTransition(current, idx);
    history.push({
      step: i + 1,
      transition: transId,
      marking: [...current],
    });
  }

  return { history, error: null };
}

/**
 * Calcule la matrice d'incidence W = Post – Pre.
 * @param {number[][]} post
 * @param {number[][]} pre
 * @returns {number[][]}
 */
export function computeIncidenceMatrix(post, pre) {
  return post.map((row, i) => row.map((val, j) => val - pre[i][j]));
}

/**
 * Vérifie la propriété d'invariant du caissier : M(P2) + M(P3) + M(P4) = 1
 * @param {number[]} marking
 * @returns {boolean}
 */
export function checkCashierInvariant(marking) {
  return marking[1] + marking[2] + marking[3] === 1;
}

/**
 * Parse une chaîne de saisie utilisateur en séquence de transitions.
 * Accepte "T1,T2,T3" ou "T1 T2 T3" ou "T1, T2, T3".
 * @param {string} input
 * @returns {string[]}
 */
export function parseSequenceInput(input) {
  return input
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
