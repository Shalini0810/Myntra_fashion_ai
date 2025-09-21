import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Badge, ProgressBar } from 'react-bootstrap'
import { useUser } from '../../context/UserContext'
import { aiService } from '../../services/aiService'
import ImageUpload from './Shared/ImageUpload'
import StyleRecommendationCard from './Shared/StyleRecommendationCard'
import TextChat from './Phase1/TextChat'
import { AIThinkingLoader } from './Shared/LoadingSpinner'
import toast from 'react-hot-toast'

const AIStylerMain = () => {
  const [currentStep, setCurrentStep] = useState('welcome')
  const [userProfile, setUserProfile] = useState({})
  const [wardrobeImages, setWardrobeImages] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  
  const { state: userState, dispatch } = useUser()

  const renderWelcome = () => (
    <div className="welcome-section">
      {/* Hero Section */}
      <div 
        className="hero-section text-white py-5 mb-5 rounded"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="display-3 fw-bold mb-4">
                  AI-Powered Personal Stylist
                  <span className="d-block display-6 mt-2">✨ At Your Service</span>
                </h1>
                <p className="lead mb-4">
                  Get personalized fashion recommendations using advanced AI technology. 
                  From style quizzes to voice commands, discover your perfect look in minutes.
                </p>
                <div className="mb-4">
                  <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                    🤖 AI-Powered
                  </Badge>
                  <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                    🎯 Personalized
                  </Badge>
                  <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                    ⚡ Quick Results
                  </Badge>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    🛍️ Real Products
                  </Badge>
                </div>
                <div className="d-flex gap-3 flex-wrap">
                  <Button 
                    variant="warning" 
                    size="lg" 
                    className="px-5 py-3 fw-bold"
                    onClick={() => {
                      setCurrentStep('profile')
                      if (!userState.isAuthenticated) {
                        const mockUser = {
                          id: Date.now(),
                          name: 'Style Explorer',
                          email: 'user@myntra.com',
                          avatar: `https://ui-avatars.io/api/?name=Style+Explorer&background=667eea&color=fff&size=40`,
                          subscription: { tier: 'basic' }
                        }
                        dispatch({ type: 'LOGIN', payload: mockUser })
                      }
                      toast.success('Welcome! Let\'s discover your style!')
                    }}
                  >
                    🎨 Start Quick Styling
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    className="px-5 py-3"
                    onClick={() => window.open('/styler', '_self')}
                  >
                    🌟 Full AI Experience
                  </Button>
                </div>
                <div className="mt-4">
                  <small className="opacity-75">
                    ✓ No signup required • ✓ Get styled in 5 minutes • ✓ Real product recommendations
                  </small>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-features">
                <Row className="g-3">
                  {[
                    { icon: '📝', title: 'Style Assessment', desc: 'AI analyzes your preferences', color: 'rgba(255,193,7,0.2)' },
                    { icon: '👗', title: 'Smart Wardrobe', desc: 'Upload & organize clothes', color: 'rgba(40,167,69,0.2)' },
                    { icon: '🤖', title: 'AI Recommendations', desc: 'Personalized style advice', color: 'rgba(13,110,253,0.2)' },
                    { icon: '💬', title: 'Chat Assistant', desc: 'Ask styling questions', color: 'rgba(220,53,69,0.2)' }
                  ].map((feature, i) => (
                    <Col md={6} key={i}>
                      <div 
                        className="text-center p-4 rounded-3 h-100"
                        style={{ 
                          background: 'rgba(255,255,255,0.15)', 
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <div 
                          className="display-4 mb-3 p-3 rounded-circle mx-auto"
                          style={{ 
                            background: feature.color,
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {feature.icon}
                        </div>
                        <h6 className="mb-2">{feature.title}</h6>
                        <small className="opacity-75">{feature.desc}</small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* How It Works Section */}
      <Container>
        <Row className="mb-5">
          <Col>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold">How AI Styling Works</h2>
              <p className="lead text-muted">Get personalized fashion advice in 4 simple steps</p>
            </div>
          </Col>
        </Row>
        
        <Row className="g-4 mb-5">
          {[
            {
              step: '1',
              title: 'Style Profile',
              description: 'Answer quick questions about your style preferences, lifestyle, and body type',
              icon: '🎯',
              color: 'primary'
            },
            {
              step: '2', 
              title: 'Upload Wardrobe',
              description: 'Take photos of your favorite clothes or pieces you want to style',
              icon: '📸',
              color: 'success'
            },
            {
              step: '3',
              title: 'AI Analysis',
              description: 'Our AI analyzes your profile and wardrobe to understand your style DNA',
              icon: '🧠',
              color: 'warning'
            },
            {
              step: '4',
              title: 'Get Recommendations',
              description: 'Receive personalized outfit suggestions and shopping recommendations',
              icon: '✨',
              color: 'info'
            }
          ].map((item, index) => (
            <Col md={6} lg={3} key={index}>
              <Card className="text-center h-100 border-0 shadow-sm position-relative">
                <Card.Body className="p-4">
                  <div 
                    className={`rounded-circle bg-${item.color} text-white d-flex align-items-center justify-content-center mx-auto mb-3 position-relative`}
                    style={{ width: '70px', height: '70px' }}
                  >
                    <span className="display-6">{item.icon}</span>
                    <Badge 
                      bg="dark" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.7em' }}
                    >
                      {item.step}
                    </Badge>
                  </div>
                  <h5 className="mb-3">{item.title}</h5>
                  <p className="text-muted small">{item.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Features Showcase */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-lg overflow-hidden">
              <div 
                className="p-5"
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)'
                }}
              >
                <Row className="align-items-center text-white">
                  <Col lg={6}>
                    <h3 className="fw-bold mb-3">What Makes Our AI Special?</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3 d-flex align-items-center">
                        <span className="me-3 fs-4">🎨</span>
                        <div>
                          <strong>Personalized Style DNA:</strong> Understands your unique preferences and lifestyle
                        </div>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <span className="me-3 fs-4">🛍️</span>
                        <div>
                          <strong>Real Products:</strong> Recommendations link to actual items you can purchase
                        </div>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <span className="me-3 fs-4">🔄</span>
                        <div>
                          <strong>Learning AI:</strong> Gets better with each interaction and feedback
                        </div>
                      </li>
                      <li className="mb-0 d-flex align-items-center">
                        <span className="me-3 fs-4">💬</span>
                        <div>
                          <strong>Interactive Chat:</strong> Ask questions and get instant styling advice
                        </div>
                      </li>
                    </ul>
                  </Col>
                  <Col lg={6} className="text-center">
                    <div className="position-relative">
                      <div 
                        className="bg-white bg-opacity-25 rounded-4 p-4"
                        style={{ backdropFilter: 'blur(10px)' }}
                      >
                        <div className="display-1 mb-3">🤖</div>
                        <h5>Advanced AI Technology</h5>
                        <p className="mb-0 opacity-75">
                          Powered by machine learning and computer vision
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        {/* CTA Section */}
        <Row>
          <Col>
            <Card className="border-0 text-center bg-light">
              <Card.Body className="p-5">
                <h3 className="mb-3">Ready to Transform Your Style?</h3>
                <p className="text-muted mb-4 lead">
                  Join thousands who've discovered their perfect style with AI assistance
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-5"
                    onClick={() => setCurrentStep('profile')}
                  >
                    🚀 Start Your Style Journey
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="lg" 
                    className="px-5"
                    onClick={() => setCurrentStep('chat')}
                  >
                    💬 Try AI Chat First
                  </Button>
                </div>
                <div className="mt-4">
                  <Row className="text-center">
                    <Col md={3}>
                      <div className="mb-2">
                        <span className="display-6">⚡</span>
                      </div>
                      <h6>5 Minutes</h6>
                      <small className="text-muted">Quick setup</small>
                    </Col>
                    <Col md={3}>
                      <div className="mb-2">
                        <span className="display-6">🎯</span>
                      </div>
                      <h6>95% Accuracy</h6>
                      <small className="text-muted">Style matching</small>
                    </Col>
                    <Col md={3}>
                      <div className="mb-2">
                        <span className="display-6">🛍️</span>
                      </div>
                      <h6>1000+ Brands</h6>
                      <small className="text-muted">Product database</small>
                    </Col>
                    <Col md={3}>
                      <div className="mb-2">
                        <span className="display-6">❤️</span>
                      </div>
                      <h6>50K+ Users</h6>
                      <small className="text-muted">Happy customers</small>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )

  const renderProfile = () => {
    const [formData, setFormData] = useState({
      age: '',
      gender: '',
      style: '',
      bodyType: '',
      lifestyle: '',
      budget: '',
      colors: [],
      occasions: []
    })

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    const handleArrayToggle = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].includes(value) 
          ? prev[field].filter(item => item !== value)
          : [...prev[field], value]
      }))
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      
      try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        setUserProfile(formData)
        setCurrentStep('wardrobe')
        toast.success('Profile created! Now let\'s see your wardrobe.')
      } catch (error) {
        toast.error('Failed to create profile. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h3 className="mb-0">🎯 Create Your Style Profile</h3>
                <p className="mb-0 opacity-75">Help our AI understand your preferences</p>
              </Card.Header>
              <Card.Body className="p-4">
                <ProgressBar now={25} className="mb-4" />
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age Range</Form.Label>
                        <Form.Select 
                          value={formData.age} 
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          required
                        >
                          <option value="">Select age range</option>
                          <option value="18-25">18-25</option>
                          <option value="26-35">26-35</option>
                          <option value="36-45">36-45</option>
                          <option value="46-55">46-55</option>
                          <option value="55+">55+</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select 
                          value={formData.gender} 
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Style Preference</Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                      {['Casual', 'Professional', 'Trendy', 'Classic', 'Bohemian', 'Minimalist', 'Edgy', 'Romantic'].map(style => (
                        <Button
                          key={style}
                          variant={formData.style === style ? 'primary' : 'outline-primary'}
                          size="sm"
                          onClick={() => handleInputChange('style', style)}
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Lifestyle</Form.Label>
                    <Form.Select 
                      value={formData.lifestyle} 
                      onChange={(e) => handleInputChange('lifestyle', e.target.value)}
                      required
                    >
                      <option value="">Select lifestyle</option>
                      <option value="student">Student</option>
                      <option value="working-professional">Working Professional</option>
                      <option value="work-from-home">Work From Home</option>
                      <option value="stay-at-home-parent">Stay-at-home Parent</option>
                      <option value="entrepreneur">Entrepreneur</option>
                      <option value="retired">Retired</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Budget Range (per item)</Form.Label>
                    <Form.Select 
                      value={formData.budget} 
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      required
                    >
                      <option value="">Select budget</option>
                      <option value="under-500">Under ₹500</option>
                      <option value="500-1500">₹500 - ₹1,500</option>
                      <option value="1500-3000">₹1,500 - ₹3,000</option>
                      <option value="3000-5000">₹3,000 - ₹5,000</option>
                      <option value="above-5000">Above ₹5,000</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Favorite Colors</Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                      {['Black', 'White', 'Blue', 'Red', 'Green', 'Pink', 'Purple', 'Yellow', 'Orange', 'Brown', 'Gray', 'Navy'].map(color => (
                        <Button
                          key={color}
                          variant={formData.colors.includes(color) ? 'primary' : 'outline-primary'}
                          size="sm"
                          onClick={() => handleArrayToggle('colors', color)}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between mt-4">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setCurrentStep('welcome')}
                    >
                      ← Back
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <AIThinkingLoader size="sm" />
                          Processing...
                        </>
                      ) : (
                        'Next: Wardrobe →'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  const renderWardrobe = () => {
    const handleImageUpload = async (files) => {
      setIsLoading(true)
      try {
        // Process images
        const processedImages = Array.from(files).map(file => ({
          id: Date.now() + Math.random(),
          file,
          url: URL.createObjectURL(file),
          category: 'uncategorized',
          color: 'unknown',
          style: 'casual'
        }))
        
        setWardrobeImages(prev => [...prev, ...processedImages])
        toast.success(`Added ${files.length} items to your wardrobe!`)
      } catch (error) {
        toast.error('Failed to upload images')
      } finally {
        setIsLoading(false)
      }
    }

    const handleNext = () => {
      if (wardrobeImages.length === 0) {
        toast.error('Please upload at least one item')
        return
      }
      setCurrentStep('styling')
    }

    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-success text-white text-center py-4">
                <h3 className="mb-0">👗 Upload Your Wardrobe</h3>
                <p className="mb-0 opacity-75">Take photos of clothes you want to style</p>
              </Card.Header>
              <Card.Body className="p-4">
                <ProgressBar now={50} className="mb-4" />
                
                <div className="text-center mb-4">
                  <ImageUpload 
                    onUpload={handleImageUpload}
                    multiple={true}
                    accept="image/*"
                  />
                </div>

                {wardrobeImages.length > 0 && (
                  <div className="mb-4">
                    <h5>Your Wardrobe ({wardrobeImages.length} items)</h5>
                    <Row className="g-3">
                      {wardrobeImages.map(item => (
                        <Col key={item.id} md={3}>
                          <Card className="border-0 shadow-sm">
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                              <img 
                                src={item.url} 
                                alt="Wardrobe item" 
                                className="card-img-top w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <Card.Body className="p-2">
                              <Badge bg="secondary" className="small">
                                {item.category}
                              </Badge>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setCurrentStep('profile')}
                  >
                    ← Back
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={handleNext}
                    disabled={wardrobeImages.length === 0}
                  >
                    Get AI Recommendations →
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  const renderStyling = () => {
    useEffect(() => {
      generateRecommendations()
    }, [])

    const generateRecommendations = async () => {
      setIsLoading(true)
      try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        const mockRecommendations = [
          {
            id: 1,
            title: 'Classic White Button-Down Shirt',
            description: 'Versatile piece that works for both casual and formal occasions',
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
            price: '₹2,499',
            brand: 'H&M',
            category: 'Shirts',
            confidence: 95,
            reason: 'Perfect match for your professional lifestyle and classic style preference',
            buyLink: 'https://www.myntra.com/shirts',
            colors: ['White', 'Light Blue']
          },
          {
            id: 2,
            title: 'Dark Wash Skinny Jeans',
            description: 'Comfortable and flattering jeans for everyday wear',
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
            price: '₹3,999',
            brand: 'Levi\'s',
            category: 'Jeans',
            confidence: 92,
            reason: 'Complements your body type and color preferences',
            buyLink: 'https://www.myntra.com/jeans',
            colors: ['Dark Blue', 'Black']
          },
          {
            id: 3,
            title: 'Comfortable Block Heels',
            description: 'Perfect for work and can be dressed up or down',
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
            price: '₹1,999',
            brand: 'Aldo',
            category: 'Footwear',
            confidence: 88,
            reason: 'Ideal for your professional lifestyle while maintaining comfort',
            buyLink: 'https://www.myntra.com/heels',
            colors: ['Black', 'Nude', 'Brown']
          }
        ]
        
        setRecommendations(mockRecommendations)
        toast.success('AI recommendations generated!')
      } catch (error) {
        toast.error('Failed to generate recommendations')
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <Container>
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-warning text-dark text-center py-4">
            <h3 className="mb-0">✨ Your AI Style Recommendations</h3>
            <p className="mb-0">Personalized suggestions based on your profile and wardrobe</p>
          </Card.Header>
          <Card.Body className="p-4">
            <ProgressBar now={75} className="mb-4" />
            
            {isLoading ? (
              <div className="text-center py-5">
                <AIThinkingLoader message="AI is analyzing your style profile and wardrobe..." />
                <p className="text-muted mt-3">
                  This may take a few moments while we find perfect matches for you
                </p>
              </div>
            ) : (
              <>
                <Row className="g-4 mb-4">
                  {recommendations.map(rec => (
                    <Col key={rec.id} lg={4} md={6}>
                      <StyleRecommendationCard 
                        recommendation={rec}
                        onAddToWishlist={(item) => {
                          toast.success(`Added ${item.title} to wishlist!`)
                        }}
                        onBuyNow={(item) => {
                          window.open(item.buyLink, '_blank')
                        }}
                      />
                    </Col>
                  ))}
                </Row>
                
                <div className="text-center">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setCurrentStep('chat')}
                  >
                    💬 Chat with AI Stylist
                  </Button>
                </div>
              </>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={() => setCurrentStep('wardrobe')}
              >
                ← Back to Wardrobe
              </Button>
              <Button 
                variant="warning" 
                onClick={generateRecommendations}
                disabled={isLoading}
              >
                🔄 Generate New Recommendations
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  const renderChat = () => (
    <Container>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-info text-white text-center py-4">
          <h3 className="mb-0">💬 Chat with Your AI Stylist</h3>
          <p className="mb-0 opacity-75">Ask questions, get advice, or request specific styling help</p>
        </Card.Header>
        <Card.Body className="p-0" style={{ height: '600px' }}>
          <TextChat 
            userProfile={userProfile}
            wardrobeItems={wardrobeImages}
            recommendations={recommendations}
            onChatUpdate={setChatHistory}
          />
        </Card.Body>
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={() => setCurrentStep(recommendations.length > 0 ? 'styling' : 'welcome')}
            >
              ← Back
            </Button>
            <Badge bg="success" className="px-3 py-2">
              ✓ Styling Complete!
            </Badge>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  )

  return (
    <div className="ai-styler-main py-4">
      {currentStep === 'welcome' && renderWelcome()}
      {currentStep === 'profile' && renderProfile()}
      {currentStep === 'wardrobe' && renderWardrobe()}
      {currentStep === 'styling' && renderStyling()}
      {currentStep === 'chat' && renderChat()}
    </div>
  )
}

export default AIStylerMain