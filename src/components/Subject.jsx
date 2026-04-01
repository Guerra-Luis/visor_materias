import React from 'react'
import { usePensum } from '../context/PensumContext'
import { SUBJECT_STATES, STATE_STYLES } from '../constants/subjectStates'


export function Subject({ subjectData }) {
  const { getSubjectState, setSubjectState } = usePensum()

  const currentState = getSubjectState(subjectData['codigo'])
  const styles = STATE_STYLES[currentState]

  const handleClick = () => {
    const stateOrder = ['available', 'in_progress', 'passed']
    const currentIndex = stateOrder.indexOf(currentState)
    const nextState = stateOrder[(currentIndex + 1) % stateOrder.length]
    setSubjectState(subjectData['codigo'], nextState)
  }

  return (
    <div
      className={
        `rounded-lg w-64 p-4 border-2 cursor-pointer inline-block 
        ${styles.bg} ${styles.border} ${styles.text}
      `}
      onClick={handleClick}
    >
      <div className='flex justify-between'>
        <span>{subjectData['codigo']}</span>
        <span>{subjectData['UC']} UC</span>
      </div>
      <div className='inline-block'>{subjectData['nombre']}</div>
    </div>
  )
}
