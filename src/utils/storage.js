const STORAGE_KEY = 'visor_materias_progress'
const SELECTION_STORAGE_KEY = 'visor_materias_selection'

export function saveSubjectStates(states) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch (error) {
    console.error('Error guardando en localStorage:', error)
  }
}

export function saveSelectionStates(states) {
  try {
    localStorage.setItem(
      SELECTION_STORAGE_KEY,
      JSON.stringify(states)
    )
  } catch (error) {
    console.error('Error guardando selecciones:', error)
  }
}

export function loadSubjectStates() {
  try {
    const states = localStorage.getItem(STORAGE_KEY)
    return states ? JSON.parse(states) : {}
  } catch (error) {
    console.error('Error cargando desde localStorage:', error)
    return null
  }
}

export function loadSelectionStates() {
  try {
    const states = localStorage.getItem(SELECTION_STORAGE_KEY)
    return states ? JSON.parse(states) : {}
  } catch (error) {
    console.error('Error cargando selecciones:', error)
    return null
  }
}

export function clearSubjectStates() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error limpiando localStorage:', error)
  }
}
