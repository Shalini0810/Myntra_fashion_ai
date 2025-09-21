import React, { useState, useRef, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Form, InputGroup } from 'react-bootstrap'
import { aiService } from '../services/aiService'

const ImageMatching = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matches, setMatches] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  
  // Chat functionality
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setMatches([])
      setAnalysis(null)
      setError(null)
      setShowChat(false)
      setChatMessages([])
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Analyze the uploaded image
      const imageAnalysis = await aiService.analyzeStyleImage(selectedImage, {})
      setAnalysis(imageAnalysis)
      setShowChat(true)

      // Add welcome message to chat
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        message: `I've analyzed your ${imageAnalysis.detectedItems?.[0]?.type || 'item'}! What would you like me to help you find? You can ask me things like:
        
• "Find me a matching top"
• "Show me accessories for this outfit"
• "What shoes would go with this?"
• "Complete this look for a party"`,
        timestamp: new Date().toISOString()
      }
      
      setChatMessages([welcomeMessage])
    } catch (err) {
      setError('Failed to analyze image. Please try again.')
      console.error('Image analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!currentMessage.trim() || !analysis) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsChatLoading(true)

    try {
      // Get AI response and matching items
      const response = await aiService.processImageMatchingChat({
        message: currentMessage,
        imageAnalysis: analysis,
        conversationHistory: chatMessages
      })

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: response.reply,
        timestamp: new Date().toISOString()
      }

      setChatMessages(prev => [...prev, botMessage])
      
      // Update matches if AI found specific items
      if (response.matchingItems && response.matchingItems.length > 0) {
        setMatches(response.matchingItems)
      }

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: "I'm sorry, I'm having trouble processing your request right now. Please try asking again in a different way.",
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setCurrentMessage(question)
  }

  const quickQuestions = [
    "Find me a matching top",
    "Show me accessories",
    "What shoes would work?",
    "Complete this party look",
    "Find me a jacket",
    "Show me jewelry options"
  ]

  const handleAddToWishlist = (item) => {
    console.log('Added to wishlist:', item)
  }

  const handleBuyNow = (item) => {
    if (item.buyLink) {
      window.open(item.buyLink, '_blank')
    }
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={12}>
          <div className="text-center mb-4">
            <h2>📸 Image-Based Matching</h2>
            <p className="text-muted">Upload an image and chat with AI to find exactly what you need</p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Upload Image</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                {imagePreview ? (
                  <div className="mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded p-5 mb-3"
                    style={{ borderColor: '#dee2e6', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div style={{ fontSize: '3rem' }}>📷</div>
                    <p className="text-muted mb-0">Click to upload image</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="d-none"
                />

                {selectedImage && (
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze & Start Chat'
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {analysis && (
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-info text-white">
                <h6 className="mb-0">🤖 AI Analysis</h6>
              </Card.Header>
              <Card.Body>
                <p className="mb-2"><strong>Analysis:</strong> {analysis.analysis}</p>
                {analysis.detectedItems && (
                  <div>
                    <p className="mb-2"><strong>Detected Items:</strong></p>
                    {analysis.detectedItems.map((item, index) => (
                      <Badge key={index} bg="secondary" className="me-1 mb-1">
                        {item.type} ({item.color})
                      </Badge>
                    ))}
                  </div>
                )}
                {analysis.dominantColors && (
                  <div className="mt-2">
                    <p className="mb-2"><strong>Colors:</strong></p>
                    {analysis.dominantColors.map((color, index) => (
                      <Badge key={index} bg="primary" className="me-1">
                        {color}
                      </Badge>
                    ))}
                  </div>
                )}
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

          {showChat && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">💬 Chat with AI Stylist</h5>
              </Card.Header>
              <Card.Body>
                {/* Chat Messages */}
                <div 
                  className="chat-messages mb-3" 
                  style={{ height: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem', padding: '1rem' }}
                >
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`mb-3 ${msg.type === 'user' ? 'text-end' : 'text-start'}`}>
                      <div 
                        className={`d-inline-block p-2 rounded ${
                          msg.type === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-light text-dark'
                        }`}
                        style={{ maxWidth: '80%' }}
                      >
                        <div style={{ whiteSpace: 'pre-line' }}>{msg.message}</div>
                        <small className={`d-block mt-1 ${msg.type === 'user' ? 'text-light' : 'text-muted'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </small>
                      </div>
                    </div>
                  ))}
                  
                  {isChatLoading && (
                    <div className="text-start mb-3">
                      <div className="d-inline-block p-2 rounded bg-light">
                        <Spinner size="sm" className="me-2" />
                        AI is thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Questions */}
                <div className="mb-3">
                  <small className="text-muted">Quick questions:</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <Form onSubmit={handleChatSubmit}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Ask me anything about styling this item..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      disabled={isChatLoading}
                    />
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={!currentMessage.trim() || isChatLoading}
                    >
                      Send
                    </Button>
                  </InputGroup>
                </Form>
              </Card.Body>
            </Card>
          )}

          {matches.length > 0 && (
            <div>
              <h4 className="mb-3">🎯 AI Recommendations</h4>
              <Row>
                {matches.map((item) => (
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
                          <Badge bg="success">{item.matchScore || item.confidence}% Match</Badge>
                        </div>
                        <h6 className="card-title">{item.title}</h6>
                        <p className="card-text text-muted small">{item.description}</p>
                        
                        {item.reason && (
                          <div className="mb-2 p-2 bg-light rounded">
                            <small className="text-muted">
                              <strong>🤖 Why this works:</strong> {item.reason}
                            </small>
                          </div>
                        )}

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="h6 text-primary mb-0">{item.price}</span>
                            {item.originalPrice && (
                              <small className="text-muted text-decoration-line-through">
                                {item.originalPrice}
                              </small>
                            )}
                          </div>
                          <div className="d-grid gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleBuyNow(item)}
                            >
                              Shop Now
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleAddToWishlist(item)}
                            >
                              Add to Wishlist
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

          {!showChat && !isAnalyzing && selectedImage && (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem', opacity: 0.3 }}>🔍</div>
              <p className="text-muted">Click "Analyze & Start Chat" to begin styling with AI</p>
            </div>
          )}

          {!selectedImage && (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', opacity: 0.3 }}>📸</div>
              <h4 className="text-muted">Upload an image to get started</h4>
              <p className="text-muted">Upload any clothing item and chat with our AI to find perfect matches</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ImageMatching