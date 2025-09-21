import React, { useState } from 'react'
import { Navbar, Nav, Container, Button, Badge, Dropdown, NavDropdown } from 'react-bootstrap'
import { useUser } from '../../context/UserContext'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const { state: userState, dispatch } = useUser()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const handleLogin = () => {
    const mockUser = {
      id: 1,
      name: 'Style Enthusiast',
      email: 'user@myntra.com',
      avatar: `https://ui-avatars.io/api/?name=Style+Enthusiast&background=667eea&color=fff&size=40`,
      subscription: {
        tier: 'premium',
        expires: '2024-12-31'
      },
      preferences: {
        style: 'modern',
        colors: ['blue', 'white', 'black'],
        budget: 'medium'
      }
    }
    
    dispatch({ type: 'LOGIN', payload: mockUser })
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const getSubscriptionBadge = () => {
    const tier = userState.profile?.subscription?.tier || 'basic'
    const colors = {
      'basic': 'secondary',
      'premium': 'warning',
      'pro': 'success'
    }
    
    return (
      <Badge bg={colors[tier]} className="ms-2">
        {tier.toUpperCase()}
      </Badge>
    )
  }

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <span className="fs-3">👗</span>
          <span className="ms-2">AI Styler</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/quick-style" 
              className={isActive('/quick-style')}
            >
              ⚡ Quick Style
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/styler" 
              className={isActive('/styler')}
            >
              🌟 Full AI Experience
            </Nav.Link>

            <NavDropdown title="🔧 Features" id="features-dropdown">
              <NavDropdown.Item as={Link} to="/quick-style">
                📝 Style Quiz
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/quick-style">
                👗 Wardrobe Upload
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/styler">
                🎤 Voice Styling
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/styler">
                📸 Image Analysis
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/styler">
                🌟 All Features
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav className="align-items-center">
            {userState.isAuthenticated ? (
              <>
                <Nav.Link className="position-relative me-3">
                  <span className="fs-5">🔔</span>
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6em' }}
                  >
                    3
                  </Badge>
                </Nav.Link>

                <Dropdown show={showUserMenu} onToggle={setShowUserMenu}>
                  <Dropdown.Toggle 
                    variant="link" 
                    className="text-decoration-none d-flex align-items-center"
                    id="user-dropdown"
                  >
                    <img 
                      src={userState.profile?.avatar || `https://ui-avatars.io/api/?name=User&background=6c757d&color=fff&size=32`}
                      alt="Profile"
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px' }}
                    />
                    <span className="text-dark">{userState.profile?.name || 'User'}</span>
                    {getSubscriptionBadge()}
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end">
                    <Dropdown.Header>
                      <div className="d-flex align-items-center">
                        <img 
                          src={userState.profile?.avatar || `https://ui-avatars.io/api/?name=User&background=6c757d&color=fff&size=40`}
                          alt="Profile"
                          className="rounded-circle me-2"
                          style={{ width: '40px', height: '40px' }}
                        />
                        <div>
                          <div className="fw-bold">{userState.profile?.name || 'User'}</div>
                          <small className="text-muted">{userState.profile?.email}</small>
                        </div>
                      </div>
                    </Dropdown.Header>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item as={Link} to="/profile">
                      👤 My Profile
                    </Dropdown.Item>
                    
                    <Dropdown.Item as={Link} to="/wardrobe">
                      👗 My Wardrobe
                    </Dropdown.Item>
                    
                    <Dropdown.Item as={Link} to="/recommendations">
                      💡 My Recommendations
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item>
                      ⚙️ Settings
                    </Dropdown.Item>
                    
                    <Dropdown.Item>
                      💎 Upgrade Plan
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      🚪 Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleLogin}
                >
                  Get Started
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header