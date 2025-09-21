import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/main.css'

// Mock user for development
const mockUser = {
  id: 'user_123',
  name: 'Demo User',
  email: 'demo@myntra.com',
  token: 'mock_token_123'
}

// Set mock user in localStorage for development
if (!localStorage.getItem('user')) {
  localStorage.setItem('user', JSON.stringify(mockUser))
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)