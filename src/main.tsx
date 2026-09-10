import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Kick off loading the kötött írás betűtípusát induláskor, hogy mire Panka
// odaér az Írás modulhoz, már készen álljon (lásd WritingModule.tsx —
// a canvas fillText ettől függetlenül is megvárja, ez csak a késleltetést
// csökkenti a gyakorlatban).
void document.fonts.load('1em "Magyar Script Basic"')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
