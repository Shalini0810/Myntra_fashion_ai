import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

export default function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">AI Stylist</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#image">Image Match</Nav.Link>
          <Nav.Link href="#wishlist">Wishlist</Nav.Link>
          <Nav.Link href="#occasion">Occasion</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
