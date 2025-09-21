import React, { createContext, useContext, useReducer, useEffect } from 'react'

const UserContext = createContext()

const initialState = {
  isAuthenticated: false,
  profile: null,
  wardrobe: [],
  preferences: {},
  subscription: null,
  stylingHistory: [],
  isLoading: false,
  error: null
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        profile: action.payload,
        subscription: action.payload.subscription,
        preferences: action.payload.preferences || {},
        isLoading: false,
        error: null
      }
    
    case 'LOGOUT':
      return {
        ...initialState
      }
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload }
      }
    
    case 'UPDATE_WARDROBE':
      return {
        ...state,
        wardrobe: action.payload
      }
    
    case 'ADD_WARDROBE_ITEM':
      return {
        ...state,
        wardrobe: [...state.wardrobe, action.payload]
      }
    
    case 'REMOVE_WARDROBE_ITEM':
      return {
        ...state,
        wardrobe: state.wardrobe.filter(item => item.id !== action.payload)
      }
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      }
    
    case 'ADD_STYLING_HISTORY':
      return {
        ...state,
        stylingHistory: [...state.stylingHistory, action.payload]
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user_profile')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        dispatch({ type: 'LOGIN', payload: userData })
      } catch (error) {
        console.error('Failed to load user data:', error)
        localStorage.removeItem('user_profile')
      }
    }
  }, [])

  // Save user data to localStorage when profile changes
  useEffect(() => {
    if (state.isAuthenticated && state.profile) {
      localStorage.setItem('user_profile', JSON.stringify(state.profile))
    } else {
      localStorage.removeItem('user_profile')
    }
  }, [state.isAuthenticated, state.profile])

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext