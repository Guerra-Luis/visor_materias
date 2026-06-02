import { useContext, createContext, useState, useMemo } from 'react'
import { SUBJECT_STATES } from '../constants/subjectStates'
import { loadSelectionStates, loadSubjectStates, saveSelectionStates, saveSubjectStates } from '../utils/storage'
import { useEffect } from 'react'

const PensumContext = createContext()

export function PensumProvider({ children, pensumData }) {
  const [subjectStates, setSubjectStates] = useState(() => {
    const saved = loadSubjectStates()
    return saved || {}
  })

  const [selectionSubjects, setSelectionSubjects] = useState(() => {
    const saved = loadSelectionStates() || {}
    return saved
  })

  const {
    subjectsByCode,
    electiveSubjects,
    sportSubjects,
  } = useMemo(() => {
    const subjectsMap = {}
    const electives = []
    const sports = []

    if (pensumData) {
      // Materias regulares por semestre
      Object.values(pensumData['semestres']).forEach(semester => {
        semester['materias'].forEach(subject => {
          if (subject.codigo) {
            subjectsMap[subject.codigo] = { ...subject, tipo: 'regular' }
          }
        })
      })
      // Asiganturas de deporte
      if (pensumData['seccion_de_deportes']?.materias) {
        pensumData['seccion_de_deportes'].materias.forEach(subject => {
          if (subject.codigo) {
            subjectsMap[subject.codigo] = { ...subject, UC: 1, tipo: 'deporte' }
            sports.push(subject.codigo)
          }
        })
      }

      //Asignaturas electivas
      if (pensumData['asignaturas_electivas']) {
        Object.values(pensumData['asignaturas_electivas']).forEach(departamentSubjects => {
          departamentSubjects.forEach(subject => {
            if (subject.codigo) {
              subjectsMap[subject.codigo] = { ...subject, tipo: 'electiva' }
              electives.push(subject.codigo)
            }
          })
        })
      }
    }
    return {
      subjectsByCode: subjectsMap,
      electiveSubjects: electives,
      sportSubjects: sports,
    }
  }, [pensumData])

  useEffect(() => {
    const noCodeSubjects = {}
    if (!pensumData) return

    Object.values(pensumData['semestres']).forEach(semester => {
      semester['materias'].forEach(subject => {
        if (!subject.codigo) {
          noCodeSubjects[subject.nombre] = undefined
        }
      })
    })

    setSelectionSubjects(prevSelection => {
      const updatedState = { ...prevSelection }

      Object.keys(noCodeSubjects).forEach(nameSubject => {
        if (updatedState[nameSubject] === undefined) {
          updatedState[nameSubject] = undefined
        }
      })

      return updatedState
    })

  }, [pensumData, setSelectionSubjects])

  useEffect(() => {
    if (Object.keys(selectionSubjects).length > 0) {
      saveSelectionStates(selectionSubjects)
    }
  }, [selectionSubjects])

  useEffect(() => {
    if (Object.keys(subjectStates).length > 0) {
      saveSubjectStates(subjectStates)
    }
  }, [subjectStates])

  const getSubjectByCode = (code) => {
    return subjectsByCode[code]
  }

  const getApprovedCredits = () => {
    let totalCredits = 0
    Object.entries(subjectStates).forEach(([code, state]) => {
      if (state === SUBJECT_STATES.PASSED && subjectsByCode[code]) {
        totalCredits += subjectsByCode[code]['UC'] || 0
      }
    })
    return totalCredits
  }

  const getApprovedSubjects = () => {
    return Object
      .values(subjectStates)
      .filter(s => s === SUBJECT_STATES.PASSED)
      .length
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

  const getSportSubjects = () => {
    return sportSubjects
  }

  const getElectiveSubjects = () => {
    return electiveSubjects
  }

  const getSelectionSubject = (name) => {
    return selectionSubjects[name]
  }

  /* const isSportSubject = (code) => {
    return sportSubjects.includes(code)
  }

  const isElectiveSubject = (code) => {
    return electiveSubjects.includes(code)
  } */

  const value = {
    subjectStates,
    getSubjectState,
    setSubjectState,
    getApprovedCredits,
    getApprovedSubjects,
    getSubjectByCode,
    getSportSubjects,
    getElectiveSubjects,
    getSelectionSubject,
    setSelectionSubjects,
    selectionSubjects,
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