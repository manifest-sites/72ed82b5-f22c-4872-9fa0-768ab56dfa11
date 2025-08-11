import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Monetization from './components/monetization/Monetization'
import HelloWorld from './components/HelloWorld'
import About from './components/About'
import CoordinateGraph from './components/CoordinateGraph'
import Navigation from './components/Navigation'
import { getRouterBasename } from './utils/routerUtils'

function App() {

  return (
    <Monetization>
      <Router basename={getRouterBasename()}>
        <Navigation />
        <Routes>
          <Route path="/" element={<HelloWorld />} />
          <Route path="/about" element={<About />} />
          <Route path="/graph" element={<CoordinateGraph />} />
        </Routes>
      </Router>
    </Monetization>
  )
}

export default App