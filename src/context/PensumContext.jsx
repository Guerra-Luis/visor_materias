import { useContext, createContext, useState, useMemo } from 'react'
import { SUBJECT_STATES } from '../constants/subjectStates'
import { loadSubjectStates, saveSubjectStates } from '../utils/storage'
import { useEffect } from 'react'

const PensumContext = createContext()

export function PensumProvider({ children, pensumData }) {
  const [subjectStates, setSubjectStates] = useState(() => {
    const saved = loadSubjectStates()
    return saved || {}
  })

  const subjectsByCode = useMemo(() => {
    const subjectsMap = {}

    if (pensumData) {
      Object.values(pensumData).forEach(semester => {
        semester['materias'].forEach(subject => {
          if (subject.codigo) {
            subjectsMap[subject.codigo] = subject
          }
        })
      })
    }
    return subjectsMap
  }, [pensumData])

  useEffect(() => {
    if (Object.keys(subjectStates).length > 0) {
      saveSubjectStates(subjectStates)
    }
  }, [subjectStates])

  const getApprovedCredits = () => {
    let totalCredits = 0
    Object.entries(subjectStates).forEach(([code, state]) => {
      if (state === SUBJECT_STATES.PASSED && subjectsByCode[code]) {
        totalCredits += subjectsByCode[code]['UC'] || 0
      }
    })
    return totalCredits
  }

  const isRequirementMet = (requirement) => {
    if (!requirement) return true

    // Requisito de creditos aprovados
    const ucaMatch = requirement.match(/^(\d+)\s*U\.C\.A\.$/)
    if (ucaMatch) {
      const requiredCredits = parseInt(ucaMatch[1])
      return getApprovedCredits() >= requiredCredits
    }

    // Requisito de materia paralela
    const parallelMatch = requirement.match(/^P\((\w+)\)$/)
    if (parallelMatch) {
      const subjectCode = parallelMatch[1]

      return (subjectStates[subjectCode] === SUBJECT_STATES.PASSED) ||
        (subjectStates[subjectCode] === SUBJECT_STATES.IN_PROGRESS)
    }

    if (subjectsByCode[requirement]) {
      return subjectStates[requirement] === SUBJECT_STATES.PASSED
    }

    else return false
  }

  const areRequirementMet = (subjectCode) => {
    const subject = subjectsByCode[subjectCode]
    if (!subject['requisitos'] || !subject) return true
    return subject['requisitos'].every(req => isRequirementMet(req))
  }

  const getSubjectState = (subjectCode) => {
    if (!subjectStates[subjectCode]) {
      if (!subjectCode) return SUBJECT_STATES.UNAVAILABLE //Esto es testeo
      if (areRequirementMet(subjectCode)) {
        return SUBJECT_STATES.AVAILABLE
      }
      return SUBJECT_STATES.UNAVAILABLE
    }
    return subjectStates[subjectCode] || 'unavailable'
  }

  const setSubjectState = (subjectCode, newState) => {
    if (newState === SUBJECT_STATES.AVAILABLE &&
      !areRequirementMet(subjectCode)) {
      return
    }

    setSubjectStates(prev => ({
      ...prev,
      [subjectCode]: newState
    }))

  }

  const value = {
    subjectStates,
    getSubjectState,
    setSubjectState,
    getApprovedCredits,
  }

  return (
    <PensumContext.Provider value={value}>
      {children}
    </PensumContext.Provider>
  )
}

//Hook personalizado para acceder al contexto
export function usePensum() {
  const context = useContext(PensumContext)

  if (context === undefined) {
    throw new Error('usePensum debe usarse dentro de un PensumProvider')
  }

  return context
}