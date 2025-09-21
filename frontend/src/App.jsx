import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// Import pages
import Home from './pages/Home'
import ImageMatching from './pages/ImageMatching'
import WishlistPairing from './pages/WishlistPairing'
import OccasionStyling from './pages/OccasionStyling'

// Import components
import Navigation from '../src/components/AIStyler/Navigation/Navigation'

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-matching" element={<ImageMatching />} />
            <Route path="/wishlist-pairing" element={<WishlistPairing />} />
            <Route path="/occasion-styling" element={<OccasionStyling />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App