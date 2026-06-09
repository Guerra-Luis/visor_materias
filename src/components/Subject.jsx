import React from 'react'
import { usePensum } from '../context/PensumContext'
import {
  SUBJECT_STATES,
  STATE_STYLES,
} from '../constants/subjectStates'
import { SubjectModal } from './SubjectModal'

export function Subject({ subjectData }) {
  const {
    getSubjectState,
    setSubjectState,
    getSubjectByCode,
    getSelectionSubject,
  } = usePensum()

  const subject =
    subjectData.codigo || !getSelectionSubject(subjectData.nombre)
      ? subjectData
      : getSubjectByCode(getSelectionSubject(subjectData.nombre))

  const currentState = getSubjectState(subject['codigo'])
  const styles = STATE_STYLES[currentState]

  const handleClickSubject = (e) => {
    if (!subject.codigo) {
      handleClickSubjectOptions(e)
      return
    }

    if (getSubjectByCode(subject.codigo)) {
      const stateOrder = ['available', 'in_progress', 'passed']
      const currentIndex = stateOrder.indexOf(currentState)
      const nextState =
        stateOrder[(currentIndex + 1) % stateOrder.length]
      setSubjectState(subject['codigo'], nextState)
    }
  }

  const handleClickSubjectOptions = (e) => {
    e.stopPropagation()
    document.getElementById(`modal_${subjectData.nombre}`).showModal()
  }

  return (
    <>
      <div
        className={`rounded-lg w-64 p-3 border-2 cursor-pointer inline-block
          ${styles.bg} ${styles.border} ${styles.text}
        `}
        onClick={(e) => handleClickSubject(e)}
      >
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">
            {subject['UC']} UC
          </span>
          <button
            className="btn-ghost"
            onClick={(e) => handleClickSubjectOptions(e)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="12"
              width="10.5"
              viewBox="0 0 448 512"
            >
              <path
                fill="rgb(106, 114, 130)"
                d="M0 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm168 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm224-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"
              />
            </svg>
          </button>
        </div>
        <span className="h-[3em] my-2 flex items-center justify-center font-semibold">
          {subject['nombre']
            .replace('LABORATORIO DE ', 'LAB. ')
            .replace('PROBLEMÁTICA ', 'PROB. ')}
        </span>
        <span className="text-sm text-gray-500">
          ({subject['codigo']})
        </span>
      </div>

      <SubjectModal
        subjectData={subjectData}
        selectedSubject={subject}
      />
    </>
  )
}
