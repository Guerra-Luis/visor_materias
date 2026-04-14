import './App.css'
import { CareerGraph } from './components/CareerGraph'
import { Footer } from './components/Footer'
import { PensumProvider, usePensum } from './context/PensumContext'
import { pensum_completo } from './data/pensum.json'

function App() {
  const pensumData = pensum_completo
  const { getApprovedCredits } = usePensum()


  const totalCredits = Object
    .values(pensumData['semestres'])
    .reduce((sumCredits, semester) => (
      sumCredits + semester['total_uc']
    ), 0)


  const totalSubjects = Object
    .values(pensumData['semestres'])
    .reduce((sumSubjects, semester) => (
      sumSubjects + semester['materias'].length
    ), 0)



  let aproveCredits = getApprovedCredits()
  let aproveSubjects = 0

  return (
    <>
      <h1>Progreso de la carrera</h1>
      <h2>Creditos aprobados: {aproveCredits} / {totalCredits} </h2>
      <h2>Materias aprobadas: {aproveSubjects} / {totalSubjects} </h2>

      <CareerGraph data={pensumData} />
      <Footer />
    </>
  )
}

export default App
