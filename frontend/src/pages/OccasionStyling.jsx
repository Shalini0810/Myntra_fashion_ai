import React, { useState } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert } from 'react-bootstrap'
import { aiService } from '../services/aiService'

const OccasionStyling = () => {
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [preferences, setPreferences] = useState({
    budget: '',
    style: '',
    colors: []
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [outfits, setOutfits] = useState([])
  const [error, setError] = useState(null)

  const occasions = [
    { id: 'wedding', name: 'Wedding', emoji: '💒', description: 'Traditional or contemporary wedding guest attire' },
    { id: 'party', name: 'Party', emoji: '🎉', description: 'Cocktail parties, celebrations, night outs' },
    { id: 'work', name: 'Work', emoji: '💼', description: 'Professional meetings, office wear' },
    { id: 'casual', name: 'Casual', emoji: '👕', description: 'Everyday wear, weekend outings' },
    { id: 'date', name: 'Date Night', emoji: '💕', description: 'Romantic dinners, date nights' },
    { id: 'travel', name: 'Travel', emoji: '✈️', description: 'Comfortable travel outfits' },
    { id: 'festival', name: 'Festival', emoji: '🪔', description: 'Traditional festivals, cultural events' },
    { id: 'gym', name: 'Gym/Sports', emoji: '🏃‍♀️', description: 'Workout, sports activities' }
  ]

  const budgetOptions = [
    { value: 'under-1000', label: 'Under ₹1,000' },
    { value: '1000-3000', label: '₹1,000 - ₹3,000' },
    { value: '3000-5000', label: '₹3,000 - ₹5,000' },
    { value: '5000-10000', label: '₹5,000 - ₹10,000' },
    { value: 'above-10000', label: 'Above ₹10,000' }
  ]

  const styleOptions = [
    { value: 'traditional', label: 'Traditional' },
    { value: 'contemporary', label: 'Contemporary' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'bohemian', label: 'Bohemian' },
    { value: 'classic', label: 'Classic' },
    { value: 'trendy', label: 'Trendy' }
  ]

  const colorOptions = [
    'Red', 'Blue', 'Black', 'White', 'Pink', 'Green', 'Yellow', 'Purple', 
    'Orange', 'Navy', 'Maroon', 'Gold', 'Silver', 'Beige', 'Brown'
  ]

  const handleOccasionSelect = (occasionId) => {
    setSelectedOccasion(occasionId)
    setOutfits([])
    setError(null)
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleColorToggle = (color) => {
    setPreferences(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  const generateOutfits = async () => {
    if (!selectedOccasion) return

    setIsGenerating(true)
    setError(null)

    try {
      const context = {
        occasion: selectedOccasion,
        preferences,
        userProfile: {
          style: preferences.style,
          budget: preferences.budget,
          colors: preferences.colors
        }
      }

      const generatedOutfits = await aiService.generateOccasionOutfits(context)
      setOutfits(generatedOutfits)
    } catch (err) {
      setError('Failed to generate outfit recommendations')
      console.error('Outfit generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveOutfit = (outfit) => {
    console.log('Saved outfit:', outfit)
    // Add save logic here
  }

  const handleShopCompleteOutfit = (outfit) => {
    // Open multiple tabs or create a cart with all items
    outfit.items.forEach((item, index) => {
      setTimeout(() => {
        if (item.buyLink) {
          window.open(item.buyLink, '_blank')
        }
      }, index * 1000) // Stagger opening tabs
    })
  }

  const selectedOccasionData = occasions.find(occ => occ.id === selectedOccasion)

  return (
    <Container className="py-4">
      <Row>
        <Col lg={12}>
          <div className="text-center mb-4">
            <h2>🎉 Occasion-Based Styling</h2>
            <p className="text-muted">Get complete outfit recommendations curated for specific occasions</p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Select Occasion</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {occasions.map((occasion) => (
                  <Button
                    key={occasion.id}
                    variant={selectedOccasion === occasion.id ? 'primary' : 'outline-primary'}
                    className="text-start p-3"
                    onClick={() => handleOccasionSelect(occasion.id)}
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-3" style={{ fontSize: '1.5rem' }}>{occasion.emoji}</span>
                      <div>
                        <div className="fw-bold">{occasion.name}</div>
                        <small className="text-muted">{occasion.description}</small>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {selectedOccasion && (
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-info text-white">
                <h6 className="mb-0">Customize Your Style</h6>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Budget Range</Form.Label>
                    <Form.Select
                      value={preferences.budget}
                      onChange={(e) => handlePreferenceChange('budget', e.target.value)}
                    >
                      <option value="">Select budget</option>
                      {budgetOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Style Preference</Form.Label>
                    <Form.Select
                      value={preferences.style}
                      onChange={(e) => handlePreferenceChange('style', e.target.value)}
                    >
                      <option value="">Select style</option>
                      {styleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Preferred Colors</Form.Label>
                    <div className="d-flex flex-wrap gap-1">
                      {colorOptions.map(color => (
                        <Badge
                          key={color}
                          bg={preferences.colors.includes(color) ? 'primary' : 'light'}
                          text={preferences.colors.includes(color) ? 'white' : 'dark'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleColorToggle(color)}
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>

                  <Button
                    variant="success"
                    className="w-100"
                    onClick={generateOutfits}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Generating Outfits...
                      </>
                    ) : (
                      `Generate ${selectedOccasionData?.name} Outfits`
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={8}>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {selectedOccasionData && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">
                  {selectedOccasionData.emoji} {selectedOccasionData.name} Styling
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{selectedOccasionData.description}</p>
              </Card.Body>
            </Card>
          )}

          {isGenerating && (
            <div className="text-center py-5">
              <Spinner variant="primary" size="lg" />
              <h5 className="mt-3">Creating Perfect Outfits...</h5>
              <p className="text-muted">Our AI is curating complete looks for your {selectedOccasionData?.name.toLowerCase()}</p>
            </div>
          )}

          {outfits.length > 0 && (
            <div>
              <h4 className="mb-3">✨ Curated Outfit Recommendations</h4>
              {outfits.map((outfit, index) => (
                <Card key={outfit.id} className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-success text-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Outfit {index + 1}: {outfit.name}</h6>
                      <Badge bg="light" text="dark">{outfit.totalPrice}</Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted mb-3">{outfit.description}</p>
                    
                    <Row>
                      {outfit.items.map((item) => (
                        <Col md={6} lg={3} key={item.id} className="mb-3">
                          <Card className="border-1">
                            <div style={{ height: '150px', overflow: 'hidden' }}>
                              <img
                                src={item.image}
                                alt={item.title}
                                className="card-img-top h-100 w-100"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <Card.Body className="p-2">
                              <h6 className="card-title small mb-1">{item.title}</h6>
                              <p className="card-text">
                                <small className="text-primary fw-bold">{item.price}</small>
                              </p>
                              <Badge bg="secondary" className="small">{item.category}</Badge>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>

                    {outfit.stylingTips && (
                      <div className="mt-3 p-3 bg-light rounded">
                        <h6>🎨 Styling Tips:</h6>
                        <ul className="mb-0">
                          {outfit.stylingTips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="small">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-3 d-flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => handleShopCompleteOutfit(outfit)}
                      >
                        🛍️ Shop Complete Outfit
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleSaveOutfit(outfit)}
                      >
                        💾 Save Outfit
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {!selectedOccasion && (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', opacity: 0.3 }}>🎉</div>
              <h4 className="text-muted">Choose an occasion to get started</h4>
              <p className="text-muted">Select any occasion from the list to get AI-curated complete outfit recommendations</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default OccasionStyling