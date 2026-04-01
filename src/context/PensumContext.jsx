import { createContext, useState, useMemo } from 'react'
import { SUBJECT_STATES } from '../constants/subjectStates'
import { useContext } from 'react'

const PensumContext = createContext()

export function PensumProvider({ children, pensumData }) {
  const [subjectStates, setSubjectStates] = useState({})

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


  const getApprovedCredits = () => {
    let totalCredits = 0
    Object.entries(subjectStates).forEach(([code, state]) => {
      if (state === SUBJECT_STATES.PASSED && subjectsByCode[code]) {
        totalCredits += subjectsByCode[code]['UC'] || 0
      }
    })
    return totalCredits
  }

  const getSubjectState = (subjectCode) => {
    return subjectStates[subjectCode] || 'unavailable'
  }

  const setSubjectState = (subjectCode, newState) => {
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