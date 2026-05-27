import React from 'react'
import { usePensum } from '../context/PensumContext'

export function SubjectModal({ subjectData }) {
  const {
    getSubjectByCode,
    getSportSubjects,
    getElectiveSubjects,
  } = usePensum()

  let subjectDataContext = undefined
  let selectionList

  if (subjectData.codigo) {
    subjectDataContext = getSubjectByCode(subjectData.codigo)
  } else if (subjectData.nombre === 'DEPORTES I') {
    selectionList = getSportSubjects().filter(sub => {
      const requisitos = getSubjectByCode(sub).requisitos
      return !requisitos && sub != '26211'
    })
  } else if (subjectData.nombre === 'DEPORTES II') {
    selectionList = getSportSubjects().filter(sub => {
      const requisitos = getSubjectByCode(sub).requisitos
      return requisitos
    })
  } else if (subjectData.nombre.includes('ELECTIVA')) {
    selectionList = getElectiveSubjects()
  }

  return (
    <dialog id={`modal_${subjectData.nombre}`} className="modal">
      <div className="modal-box flex flex-col text-left">
        <h3 className="font-bold text-lg pb-2 text-center">{subjectData.nombre}</h3>
        {
          (subjectDataContext) ?
            <>
              <p>
                <span className='font-bold'>Codigo:</span> {subjectData.codigo}
              </p>
              <p>
                <span className='font-bold'>Unidades de credito:</span> {subjectData.UC}
              </p>
              {subjectData.requisitos && <p>
                <span className='font-bold'>Requisitos:</span> {subjectData.requisitos}
              </p>}
            </>
            :
            <>
              <p>Esta materia es electiva o de deportes, elige una de las siguientes materias para asignarla</p>
              <ul>
                {
                  selectionList.map(sub => {
                    const subName = getSubjectByCode(sub).nombre

                    return (
                      <li>
                        <input type="radio" name={subjectData.nombre} className="radio" />
                        <label htmlFor={subjectData.nombre}>({sub}) {subName}</label>
                      </li>
                    )
                  })
                }
              </ul>
            </>
        }
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
