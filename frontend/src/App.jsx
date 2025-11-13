import React, { useState } from 'react'
import Scan from './components/Scan.jsx'
import Search from './components/Search.jsx'

export default function App() {
  const [tab, setTab] = useState('scan')

  return (
    <div className="app">
      <header className="app__header">
        <h1>PharmaTrust</h1>
        <nav className="app__nav">
          <button className={`tab ${tab==='scan' ? 'active' : ''}`} onClick={() => setTab('scan')}>Scan</button>
          <button className={`tab ${tab==='search' ? 'active' : ''}`} onClick={() => setTab('search')}>Search</button>
        </nav>
      </header>

      <main className="app__main">
        {tab === 'scan' ? <Scan /> : <Search />}
      </main>
    </div>
  )
}
