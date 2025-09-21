// src/pages/Home.jsx
import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <Container>
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">🎨 Fashion AI Styler</h1>
        <p className="lead text-muted">
          Your personal AI fashion assistant for perfect outfit matching
        </p>
      </div>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>📸</span>
              </div>
              <Card.Title>Image-Based Matching</Card.Title>
              <Card.Text>
                Upload an image and let our AI find matching items from our collection
              </Card.Text>
              <Button as={Link} to="/image-matching" variant="primary">
                Try Image Matching
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>💖</span>
              </div>
              <Card.Title>Wishlist Pairing</Card.Title>
              <Card.Text>
                Select items from your wishlist and get AI suggestions for complementary pieces
              </Card.Text>
              <Button as={Link} to="/wishlist-pairing" variant="primary">
                Explore Wishlist
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>🎉</span>
              </div>
              <Card.Title>Occasion-Based Styling</Card.Title>
              <Card.Text>
                Get complete outfit recommendations curated for specific occasions
              </Card.Text>
              <Button as={Link} to="/occasion-styling" variant="primary">
                Get Styled
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={8} className="mx-auto text-center">
          <h3 className="mb-4">How It Works</h3>
          <Row>
            <Col sm={4} className="mb-3">
              <div className="mb-2">🔍</div>
              <h6>Analyze</h6>
              <small className="text-muted">AI analyzes your style preferences and uploaded images</small>
            </Col>
            <Col sm={4} className="mb-3">
              <div className="mb-2">🎯</div>
              <h6>Match</h6>
              <small className="text-muted">Find perfectly matching items from our curated collection</small>
            </Col>
            <Col sm={4} className="mb-3">
              <div className="mb-2">✨</div>
              <h6>Style</h6>
              <small className="text-muted">Get complete outfit recommendations for any occasion</small>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Home