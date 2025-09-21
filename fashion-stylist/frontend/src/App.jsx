import React from 'react';
import NavBar from './components/Navbar.jsx';
import ImageMatcher from './components/ImageMatcher.jsx';
import WishlistStyler from './components/WishlistStyler.jsx';
import OccasionStyler from './components/OccasionStyler.jsx';

function App() {
  return (
    <>
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5 bg-light">
              <h1>🎨 AI Fashion Stylist</h1>
              <p className="lead">Your personal AI stylist for all occasions</p>
            </div>
          </div>
        </div>
        
        <ImageMatcher />
        <hr className="my-5" />
        
        <WishlistStyler />
        <hr className="my-5" />
        
        <OccasionStyler />
        
        <footer className="bg-dark text-white text-center py-4 mt-5">
          <p>&copy; 2024 AI Fashion Stylist. Powered by AI recommendations.</p>
        </footer>
      </div>
    </>
  );
}

export default App;