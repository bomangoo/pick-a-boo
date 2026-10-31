import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/gaegu/400.css'
import '@fontsource/gaegu/700.css'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// 페어 현장 와이파이가 불안정해도 동작하도록, 배포본에서는 한 번 열면 오프라인 캐시합니다.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  })
}
