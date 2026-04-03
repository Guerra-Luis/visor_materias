import React from 'react'
import { Semester } from './Semester'

export function CareerGraph({ data }) {
  return (
    <>
      {
        Object.entries(data['semestres']).map((semester, index) => (
          <>
            <Semester semesterData={semester} key={index} />
          </>
        ))
      }
    </>
  )
}
