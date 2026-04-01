import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PensumProvider } from './context/PensumContext.jsx'
import { pensum_completo } from './data/pensum.json'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PensumProvider pensumData={pensum_completo}>
      <App />
    </PensumProvider>
  </StrictMode>,
)
