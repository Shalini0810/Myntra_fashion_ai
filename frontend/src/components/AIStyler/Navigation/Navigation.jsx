import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🎨 Fashion AI Styler
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/image-matching"
              active={location.pathname === '/image-matching'}
            >
              📸 Image Matching
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/wishlist-pairing"
              active={location.pathname === '/wishlist-pairing'}
            >
              💖 Wishlist Pairing
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/occasion-styling"
              active={location.pathname === '/occasion-styling'}
            >
              🎉 Occasion Styling
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation