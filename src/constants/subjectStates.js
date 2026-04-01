export const SUBJECT_STATES = {
  UNAVAILABLE: 'unavailable',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  PASSED: 'passed',
}

export const STATE_STYLES = {
  [SUBJECT_STATES.UNAVAILABLE]: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-400',
    opacity: 'opacity-50',
    cursor: 'cursor-not-allowed'
  },
  [SUBJECT_STATES.AVAILABLE]: {
    bg: 'bg-white',
    border: 'border-blue-300',
    text: 'text-gray-700',
    opacity: 'opacity-100',
    cursor: 'cursor-pointer'
  },
  [SUBJECT_STATES.IN_PROGRESS]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-800',
    opacity: 'opacity-100',
    cursor: 'cursor-pointer'
  },
  [SUBJECT_STATES.PASSED]: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-800',
    opacity: 'opacity-100',
    cursor: 'cursor-pointer'
  }
}

// export const STATE_LABELS = {
//   [SUBJECT_STATES.UNAVAILABLE]: 'No disponible',
//   [SUBJECT_STATES.AVAILABLE]: 'Disponible',
//   [SUBJECT_STATES.IN_PROGRESS]: 'En curso',
//   [SUBJECT_STATES.PASSED]: 'Aprobada'
// } 