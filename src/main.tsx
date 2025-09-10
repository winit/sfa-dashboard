import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
console.log('main.tsx loaded, root element:', rootElement)

if (!rootElement) {
  console.error('Root element not found!')
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
  console.log('React app rendered')
}