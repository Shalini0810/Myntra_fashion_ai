import React, { useState, useEffect } from 'react'
import { Container, Card, Nav, Alert, Badge, Button, Row, Col } from 'react-bootstrap'
import { useUser } from '../../context/UserContext'
import { aiService } from '../../services/aiService'
import toast from 'react-hot-toast'

// Phase 1 Components
import StyleQuiz from './Phase1/StyleQuiz'
import WardrobeUpload from './Phase1/WardrobeUpload'
import BasicRecommendations from './Phase1/BasicRecommendations'
// Use TextChat as InitialChatbot since that's what exists in your codebase
import TextChat from './Phase1/TextChat'

// Phase 2 Components
import VoiceInput from './Phase2/VoiceInput'
import ImageAnalysis from './Phase2/ImageAnalysis'
import PersonaDetection from './Phase2/PersonaDetection'
import BasicVirtualTryOn from './Phase2/BasicVirtualTryOn'

// Phase 3 Components
import CrossCategoryRecommendations from './Phase3/CrossCategoryRecommendations'
import AdvancedVirtualTryOn from './Phase3/AdvancedVirtualTryOn'
import SocialStyling from './Phase3/SocialStyling'
import FeedbackLoop from './Phase3/FeedbackLoop'

// Shared Components
import { AIThinkingLoader } from './Shared/LoadingSpinner'
import PhaseNavigation from './Navigation/PhaseNavigation'
import ProgressTracker from './Navigation/ProgressTracker'

const StylerMain = () => {
  const [currentPhase, setCurrentPhase] = useState('phase1')
  const [currentComponent, setCurrentComponent] = useState('style-quiz')
  const [userProgress, setUserProgress] = useState({})
  const [phaseData, setPhaseData] = useState({
    phase1: {
      styleProfile: null,
      wardrobe: [],
      basicRecommendations: null,
      chatHistory: []
    },
    phase2: {
      voiceInteractions: [],
      imageAnalyses: [],
      detectedPersona: null,
      virtualTryOns: []
    },
    phase3: {
      crossCategoryRecs: null,
      socialData: null,
      feedbackHistory: []
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [accessLevel, setAccessLevel] = useState('basic') // basic, premium, pro
  
  const { state: userState, dispatch } = useUser()

  // Phase Configuration
  const phaseConfig = {
    phase1: {
      title: 'Foundation Setup',
      description: 'Build your style foundation with AI-guided onboarding',
      color: 'primary',
      components: [
        { id: 'style-quiz', name: 'Style Quiz', icon: '📝', component: StyleQuiz },
        { id: 'wardrobe-upload', name: 'Wardrobe Upload', icon: '👗', component: WardrobeUpload },
        { id: 'basic-recs', name: 'Initial Recommendations', icon: '💡', component: BasicRecommendations },
        { id: 'chat', name: 'AI Chat Assistant', icon: '💬', component: TextChat }
      ],
      requiredFor: 'all',
      unlocked: true
    },
    phase2: {
      title: 'Enhanced Interaction',
      description: 'Advanced AI features for deeper style understanding',
      color: 'warning',
      components: [
        { id: 'voice-input', name: 'Voice Styling', icon: '🎤', component: VoiceInput },
        { id: 'image-analysis', name: 'Image Analysis', icon: '📸', component: ImageAnalysis },
        { id: 'persona-detection', name: 'Style Persona', icon: '🎭', component: PersonaDetection },
        { id: 'virtual-tryon', name: 'Virtual Try-On', icon: '🪞', component: BasicVirtualTryOn }
      ],
      requiredFor: 'premium',
      unlocked: false
    },
    phase3: {
      title: 'Pro Styling Suite',
      description: 'Professional-grade AI styling with social integration',
      color: 'success',
      components: [
        { id: 'cross-category', name: 'Lifestyle Curation', icon: '🌟', component: CrossCategoryRecommendations },
        { id: 'advanced-tryon', name: 'Advanced Try-On', icon: '🥽', component: AdvancedVirtualTryOn },
        { id: 'social-styling', name: 'Social Community', icon: '👥', component: SocialStyling },
        { id: 'feedback-loop', name: 'AI Learning', icon: '🧠', component: FeedbackLoop }
      ],
      requiredFor: 'pro',
      unlocked: false
    }
  }

  useEffect(() => {
    initializeProgress()
    checkAccessLevel()
    unlockAvailablePhases()
  }, [userState.profile])

  const initializeProgress = () => {
    const savedProgress = localStorage.getItem('styler_progress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    } else {
      setUserProgress({
        phase1: { completed: [], current: 'style-quiz' },
        phase2: { completed: [], current: null },
        phase3: { completed: [], current: null }
      })
    }
  }

  const checkAccessLevel = () => {
    // Determine user's access level based on subscription/profile
    const level = userState.subscription?.tier || 'basic'
    setAccessLevel(level)
  }

  const unlockAvailablePhases = () => {
    const config = { ...phaseConfig }
    
    // Phase 1 is always unlocked
    config.phase1.unlocked = true
    
    // Phase 2 unlocks when Phase 1 is mostly complete
    const phase1Progress = userProgress.phase1?.completed || []
    config.phase2.unlocked = phase1Progress.length >= 2 || accessLevel !== 'basic'
    
    // Phase 3 unlocks for pro users or when Phase 2 is complete
    const phase2Progress = userProgress.phase2?.completed || []
    config.phase3.unlocked = phase2Progress.length >= 2 || accessLevel === 'pro'
  }

  const saveProgress = (phase, component, data) => {
    const updatedProgress = { ...userProgress }
    const updatedPhaseData = { ...phaseData }
    
    // Update progress tracking
    if (!updatedProgress[phase]) {
      updatedProgress[phase] = { completed: [], current: component }
    }
    
    if (!updatedProgress[phase].completed.includes(component)) {
      updatedProgress[phase].completed.push(component)
    }
    
    // Update phase data
    updatedPhaseData[phase] = { ...updatedPhaseData[phase], ...data }
    
    setUserProgress(updatedProgress)
    setPhaseData(updatedPhaseData)
    
    // Save to localStorage
    localStorage.setItem('styler_progress', JSON.stringify(updatedProgress))
    localStorage.setItem('styler_data', JSON.stringify(updatedPhaseData))
    
    // Check for phase completion and unlock next phase
    checkPhaseCompletion(phase, updatedProgress)
  }

  const checkPhaseCompletion = (phase, progress) => {
    const phaseProgress = progress[phase]?.completed || []
    const totalComponents = phaseConfig[phase].components.length
    
    if (phaseProgress.length >= Math.ceil(totalComponents * 0.75)) {
      // Phase is 75% complete, unlock next phase
      unlockAvailablePhases()
      
      if (phase === 'phase1' && !phaseConfig.phase2.unlocked) {
        toast.success('🎉 Phase 2 features unlocked!')
      } else if (phase === 'phase2' && !phaseConfig.phase3.unlocked) {
        toast.success('🎉 Phase 3 Pro features unlocked!')
      }
    }
  }

  const handlePhaseChange = (phase, component) => {
    if (!phaseConfig[phase].unlocked) {
      toast.error(`${phaseConfig[phase].title} requires ${phaseConfig[phase].requiredFor} access`)
      return
    }
    
    setCurrentPhase(phase)
    setCurrentComponent(component)
    
    // Update current component in progress
    const updatedProgress = { ...userProgress }
    if (!updatedProgress[phase]) {
      updatedProgress[phase] = { completed: [], current: component }
    } else {
      updatedProgress[phase].current = component
    }
    setUserProgress(updatedProgress)
  }

  const renderCurrentComponent = () => {
    const phase = phaseConfig[currentPhase]
    const componentConfig = phase.components.find(c => c.id === currentComponent)
    
    if (!componentConfig) {
      return (
        <Alert variant="warning">
          Component not found. Please select a valid option.
        </Alert>
      )
    }
    
    const Component = componentConfig.component
    const componentProps = getComponentProps(currentPhase, currentComponent)
    
    return (
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <span className="me-2 fs-4">{componentConfig.icon}</span>
              <div>
                <h5 className="mb-0">{componentConfig.name}</h5>
                <small className="text-muted">{phase.title}</small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              {userProgress[currentPhase]?.completed.includes(currentComponent) && (
                <Badge bg="success">✓ Completed</Badge>
              )}
              <Badge bg={phase.color}>
                {currentPhase.replace('phase', 'Phase ')}
              </Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          {isLoading ? (
            <div className="text-center py-5">
              <AIThinkingLoader message="Loading component..." />
            </div>
          ) : (
            <Component {...componentProps} />
          )}
        </Card.Body>
      </Card>
    )
  }

  const getComponentProps = (phase, component) => {
    const baseProps = {
      userProfile: userState.profile,
      wardrobeItems: phaseData.phase1.wardrobe,
      onDataUpdate: (data) => saveProgress(phase, component, data)
    }

    // Phase-specific props
    switch (phase) {
      case 'phase1':
        switch (component) {
          case 'style-quiz':
            return {
              ...baseProps,
              onComplete: (profile) => {
                saveProgress(phase, component, { styleProfile: profile })
                if (dispatch) {
                  dispatch({ type: 'UPDATE_PROFILE', payload: profile })
                }
              }
            }
          case 'wardrobe-upload':
            return {
              ...baseProps,
              onComplete: (wardrobe) => {
                saveProgress(phase, component, { wardrobe })
                if (dispatch) {
                  dispatch({ type: 'UPDATE_WARDROBE', payload: wardrobe })
                }
              }
            }
          case 'basic-recs':
            return {
              ...baseProps,
              styleProfile: phaseData.phase1.styleProfile,
              onRecommendationsGenerated: (recs) => {
                saveProgress(phase, component, { basicRecommendations: recs })
              }
            }
          case 'chat':
            return {
              ...baseProps,
              onChatUpdate: (history) => {
                saveProgress(phase, component, { chatHistory: history })
              }
            }
        }
        break

      case 'phase2':
        switch (component) {
          case 'voice-input':
            return {
              ...baseProps,
              onResult: (audioBlob, transcription) => {
                const voiceData = { audioBlob, transcription, timestamp: new Date() }
                const currentVoice = phaseData.phase2.voiceInteractions || []
                saveProgress(phase, component, { 
                  voiceInteractions: [...currentVoice, voiceData] 
                })
              }
            }
          case 'image-analysis':
            return {
              ...baseProps,
              onAnalysisComplete: (results) => {
                saveProgress(phase, component, { imageAnalyses: results })
              }
            }
          case 'persona-detection':
            return {
              ...baseProps,
              onPersonaDetected: (persona) => {
                saveProgress(phase, component, { detectedPersona: persona })
              }
            }
          case 'virtual-tryon':
            return {
              ...baseProps,
              onTryOnComplete: (results) => {
                const currentTryOns = phaseData.phase2.virtualTryOns || []
                saveProgress(phase, component, { 
                  virtualTryOns: [...currentTryOns, results] 
                })
              }
            }
        }
        break

      case 'phase3':
        switch (component) {
          case 'cross-category':
            return {
              ...baseProps,
              fashionProfile: phaseData.phase1.styleProfile,
              onRecommendationsGenerated: (recs) => {
                saveProgress(phase, component, { crossCategoryRecs: recs })
              }
            }
          case 'advanced-tryon':
            return {
              ...baseProps,
              onTryOnComplete: (results) => {
                const currentTryOns = phaseData.phase3.advancedTryOns || []
                saveProgress(phase, component, { 
                  advancedTryOns: [...currentTryOns, results] 
                })
              }
            }
          case 'social-styling':
            return {
              ...baseProps,
              onSocialRecommendations: (data) => {
                saveProgress(phase, component, { socialData: data })
              }
            }
          case 'feedback-loop':
            return {
              ...baseProps,
              onFeedbackSubmitted: (feedback) => {
                const currentFeedback = phaseData.phase3.feedbackHistory || []
                saveProgress(phase, component, { 
                  feedbackHistory: [...currentFeedback, feedback] 
                })
              }
            }
        }
        break
    }

    return baseProps
  }

  const getOverallProgress = () => {
    const totalComponents = Object.values(phaseConfig).reduce((acc, phase) => {
      return acc + phase.components.length
    }, 0)
    
    const completedComponents = Object.values(userProgress).reduce((acc, phase) => {
      return acc + (phase.completed?.length || 0)
    }, 0)
    
    return Math.round((completedComponents / totalComponents) * 100)
  }

  const getRecommendedNext = () => {
    // Logic to recommend next component based on user progress
    for (const [phaseKey, phase] of Object.entries(phaseConfig)) {
      if (!phase.unlocked) continue
      
      const progress = userProgress[phaseKey]
      const incompleteComponent = phase.components.find(comp => 
        !progress?.completed?.includes(comp.id)
      )
      
      if (incompleteComponent) {
        return { phase: phaseKey, component: incompleteComponent.id }
      }
    }
    
    return null
  }

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        {/* Sidebar Navigation */}
        <Col lg={3}>
          <div className="sticky-top" style={{ top: '20px' }}>
            {/* Progress Overview */}
            <ProgressTracker 
              userProgress={userProgress}
              phaseConfig={phaseConfig}
              overallProgress={getOverallProgress()}
              recommendedNext={getRecommendedNext()}
              onNavigate={handlePhaseChange}
            />
            
            {/* Phase Navigation */}
            <PhaseNavigation
              phaseConfig={phaseConfig}
              currentPhase={currentPhase}
              currentComponent={currentComponent}
              userProgress={userProgress}
              accessLevel={accessLevel}
              onPhaseChange={handlePhaseChange}
            />
          </div>
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          {/* Access Level Notice */}
          {accessLevel === 'basic' && (
            <Alert variant="info" className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>🌟 Unlock Advanced Features</strong>
                  <p className="mb-0 mt-1">
                    Upgrade to Premium for Phase 2 features or Pro for the complete AI styling suite.
                  </p>
                </div>
                <Button variant="primary" size="sm">
                  Upgrade Now
                </Button>
              </div>
            </Alert>
          )}

          {/* Current Component */}
          {renderCurrentComponent()}

          {/* Quick Actions */}
          <Card className="mt-4 border-0 bg-light">
            <Card.Body>
              <Row className="text-center">
                <Col md={3}>
                  <div className="mb-2">
                    <span className="display-6">📊</span>
                  </div>
                  <h6>Overall Progress</h6>
                  <Badge bg="primary" className="px-3 py-2">
                    {getOverallProgress()}%
                  </Badge>
                </Col>
                <Col md={3}>
                  <div className="mb-2">
                    <span className="display-6">🎯</span>
                  </div>
                  <h6>Completed</h6>
                  <Badge bg="success" className="px-3 py-2">
                    {Object.values(userProgress).reduce((acc, phase) => acc + (phase.completed?.length || 0), 0)} Components
                  </Badge>
                </Col>
                <Col md={3}>
                  <div className="mb-2">
                    <span className="display-6">⭐</span>
                  </div>
                  <h6>Access Level</h6>
                  <Badge bg="warning" className="px-3 py-2">
                    {accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}
                  </Badge>
                </Col>
                <Col md={3}>
                  <div className="mb-2">
                    <span className="display-6">🚀</span>
                  </div>
                  <h6>Next Phase</h6>
                  <Badge bg="info" className="px-3 py-2">
                    {getRecommendedNext() ? 
                      `Phase ${getRecommendedNext().phase.replace('phase', '')}` : 
                      'Complete!'
                    }
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default StylerMain