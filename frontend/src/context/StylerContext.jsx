import React, { createContext, useContext, useReducer } from 'react'

const StylerContext = createContext()

const initialState = {
  currentPhase: 'phase1',
  currentComponent: 'style-quiz',
  phaseProgress: {
    phase1: { completed: [], current: 'style-quiz' },
    phase2: { completed: [], current: null },
    phase3: { completed: [], current: null }
  },
  stylingData: {
    recommendations: [],
    virtualTryOns: [],
    voiceInteractions: [],
    imageAnalyses: [],
    socialData: null
  },
  isProcessing: false,
  error: null
}

const stylerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PHASE':
      return {
        ...state,
        currentPhase: action.payload.phase,
        currentComponent: action.payload.component
      }
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        phaseProgress: {
          ...state.phaseProgress,
          [action.payload.phase]: {
            ...state.phaseProgress[action.payload.phase],
            ...action.payload.progress
          }
        }
      }
    
    case 'ADD_RECOMMENDATION':
      return {
        ...state,
        stylingData: {
          ...state.stylingData,
          recommendations: [...state.stylingData.recommendations, action.payload]
        }
      }
    
    case 'ADD_VOICE_INTERACTION':
      return {
        ...state,
        stylingData: {
          ...state.stylingData,
          voiceInteractions: [...state.stylingData.voiceInteractions, action.payload]
        }
      }
    
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isProcessing: false
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    case 'RESET_STYLER':
      return initialState
    
    default:
      return state
  }
}

export const StylerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stylerReducer, initialState)

  return (
    <StylerContext.Provider value={{ state, dispatch }}>
      {children}
    </StylerContext.Provider>
  )
}

export const useStyler = () => {
  const context = useContext(StylerContext)
  if (!context) {
    throw new Error('useStyler must be used within a StylerProvider')
  }
  return context
}

export default StylerContext