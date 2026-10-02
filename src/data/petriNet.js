/**
 * Données du réseau de Pétri pour le système de paiement à un guichet.
 *
 * Places :
 *   P1 – Clients en file d'attente
 *   P2 – Caissier libre
 *   P3 – Paiement en cours
 *   P4 – Paiement validé
 *   P5 – Clients repartis avec leur reçu
 *
 * Transitions :
 *   T1 – Arrivée d'un client
 *   T2 – Début du paiement
 *   T3 – Validation du paiement
 *   T4 – Remise du reçu et départ du client
 */

export const places = [
  { id: 'P1', label: 'Clients en file d\'attente', shortLabel: 'Clients en file', icon: 'users' },
  { id: 'P2', label: 'Caissier libre', shortLabel: 'Caissier libre', icon: 'cashier' },
  { id: 'P3', label: 'Paiement en cours', shortLabel: 'Paiement en cours', icon: 'payment' },
  { id: 'P4', label: 'Paiement validé', shortLabel: 'Paiement validé', icon: 'validated' },
  { id: 'P5', label: 'Clients repartis avec leur reçu', shortLabel: 'Clients repartis', icon: 'receipt' },
];

export const transitions = [
  { id: 'T1', label: 'Arrivée d\'un client', shortLabel: 'Arrivée' },
  { id: 'T2', label: 'Début du paiement', shortLabel: 'Début paiement' },
  { id: 'T3', label: 'Validation du paiement', shortLabel: 'Validation' },
  { id: 'T4', label: 'Remise du reçu et départ du client', shortLabel: 'Remise reçu' },
];

// Marquage initial  M0 = (0, 1, 0, 0, 0)
export const initialMarking = [0, 1, 0, 0, 0];

// Matrice Pre (Places × Transitions)
//        T1  T2  T3  T4
// P1      0   1   0   0
// P2      0   1   0   0
// P3      0   0   1   0
// P4      0   0   0   1
// P5      0   0   0   0
export const Pre = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
  [0, 0, 0, 0],
];

// Matrice Post (Places × Transitions)
//        T1  T2  T3  T4
// P1      1   0   0   0
// P2      0   0   0   1
// P3      0   1   0   0
// P4      0   0   1   0
// P5      0   0   0   1
export const Post = [
  [1, 0, 0, 0],
  [0, 0, 0, 1],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

// Matrice d'incidence W = Post - Pre
//        T1  T2  T3  T4
// P1      1  -1   0   0
// P2      0  -1   0   1
// P3      0   1  -1   0
// P4      0   0   1  -1
// P5      0   0   0   1
export const W = [
  [ 1, -1,  0,  0],
  [ 0, -1,  0,  1],
  [ 0,  1, -1,  0],
  [ 0,  0,  1, -1],
  [ 0,  0,  0,  1],
];

// Messages d'erreur contextuels pour chaque transition non franchissable
export const transitionErrors = {
  T1: null, // T1 est toujours franchissable (pas de place d'entrée)
  T2: 'P1 doit contenir au moins 1 jeton (un client en file) et P2 doit contenir au moins 1 jeton (le caissier doit être libre).',
  T3: 'P3 doit contenir au moins 1 jeton (un paiement doit être en cours).',
  T4: 'P4 doit contenir au moins 1 jeton (le paiement doit être validé).',
};

export const transitionErrorShort = {
  T2: {
    P1: 'Aucun client en file d\'attente.',
    P2: 'Le caissier est occupé.',
  },
  T3: {
    P3: 'Aucun paiement en cours.',
  },
  T4: {
    P4: 'Aucun paiement validé.',
  },
};
