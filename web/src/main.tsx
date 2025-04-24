import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// CSS (ordem é importante)
import 'bootstrap/dist/css/bootstrap.min.css'
import './theme/theme.css'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)