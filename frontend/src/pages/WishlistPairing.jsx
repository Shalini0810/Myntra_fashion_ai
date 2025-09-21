import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap'
import { aiService } from '../services/aiService'

const WishlistPairing = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadWishlistItems()
  }, [])

  const loadWishlistItems = async () => {
    setIsLoading(true)
    try {
      const items = await aiService.getWishlistItems()
      setWishlistItems(items)
    } catch (err) {
      setError('Failed to load wishlist items')
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemSelect = async (item) => {
    setSelectedItem(item)
    setIsLoading(true)
    setError(null)

    try {
      const pairings = await aiService.findWishlistPairings(item)
      setRecommendations(pairings)
    } catch (err) {
      setError('Failed to find pairing suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (item) => {
    if (item.buyLink) {
      window.open(item.buyLink, '_blank')
    }
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={12}>
          <div className="text-center mb-4">
            <h2>💖 Wishlist Pairing</h2>
            <p className="text-muted">Select an item from your wishlist to find perfect matching pieces</p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Your Wishlist</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {isLoading && !selectedItem ? (
                <div className="text-center py-4">
                  <Spinner variant="primary" />
                  <p className="mt-2 text-muted">Loading wishlist...</p>
                </div>
              ) : (
                <>
                  {wishlistItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`mb-3 cursor-pointer ${selectedItem?.id === item.id ? 'border-primary' : ''}`}
                      onClick={() => handleItemSelect(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Row className="g-0">
                        <Col md={4}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="img-fluid rounded-start h-100"
                            style={{ objectFit: 'cover', height: '80px' }}
                          />
                        </Col>
                        <Col md={8}>
                          <Card.Body className="py-2">
                            <h6 className="card-title mb-1 small">{item.title}</h6>
                            <p className="card-text">
                              <small className="text-primary fw-bold">{item.price}</small>
                            </p>
                            <Badge bg="secondary" className="small">{item.category}</Badge>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {selectedItem && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">Selected Item</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="img-fluid rounded"
                    />
                  </Col>
                  <Col md={9}>
                    <h5>{selectedItem.title}</h5>
                    <p className="text-muted">{selectedItem.description}</p>
                    <div className="d-flex gap-2 mb-2">
                      <Badge bg="primary">{selectedItem.brand}</Badge>
                      <Badge bg="secondary">{selectedItem.category}</Badge>
                    </div>
                    <h6 className="text-primary">{selectedItem.price}</h6>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {isLoading && selectedItem && (
            <div className="text-center py-5">
              <Spinner variant="primary" size="lg" />
              <h5 className="mt-3">Finding Perfect Matches...</h5>
              <p className="text-muted">Our AI is analyzing your selected item to find complementary pieces</p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h4 className="mb-3">🎯 Recommended Pairings</h4>
              <Row>
                {recommendations.map((item) => (
                  <Col md={6} lg={4} key={item.id} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm">
                      <div style={{ height: '200px', overflow: 'hidden' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="card-img-top h-100 w-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex justify-content-between mb-2">
                          <Badge bg="primary">{item.brand}</Badge>
                          <Badge bg="success">{item.compatibility}% Compatible</Badge>
                        </div>
                        <h6 className="card-title">{item.title}</h6>
                        <p className="card-text text-muted small">{item.description}</p>
                        
                        {item.pairingReason && (
                          <div className="mb-2 p-2 bg-light rounded">
                            <small className="text-muted">
                              <strong>🤖 Why this works:</strong> {item.pairingReason}
                            </small>
                          </div>
                        )}

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="h6 text-primary mb-0">{item.price}</span>
                            {item.discount && (
                              <Badge bg="danger">{item.discount}</Badge>
                            )}
                          </div>
                          <div className="d-grid gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                            >
                              Add to Cart
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                            >
                              Save for Later
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {!selectedItem && (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', opacity: 0.3 }}>💖</div>
              <h4 className="text-muted">Select an item from your wishlist</h4>
              <p className="text-muted">Choose any item to discover perfectly matching pieces from our collection</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default WishlistPairing