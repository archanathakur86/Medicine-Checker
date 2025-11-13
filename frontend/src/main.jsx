import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/app.css'
import './styles/priceComparison.css'
import './styles/premium-enhancements.css'
import './styles/medicineResult.css'

const root = createRoot(document.getElementById('root'))
root.render(<App />)
