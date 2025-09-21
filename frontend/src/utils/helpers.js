export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }
  
  export const calculateDiscount = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }
  
  export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString()
    }
  }
  
  export const getStyleEmoji = (style) => {
    const emojis = {
      casual: '👕',
      professional: '👔',
      trendy: '✨',
      classic: '👗'
    }
    return emojis[style] || '👗'
  }
  
  export const getBudgetEmoji = (budget) => {
    const emojis = {
      budget: '💰',
      mid: '💳',
      premium: '💎',
      luxury: '👑'
    }
    return emojis[budget] || '💰'
  }
  
  export const getOccasionEmoji = (occasion) => {
    const emojis = {
      work: '💼',
      casual: '☀️',
      party: '🎉',
      formal: '🎭'
    }
    return emojis[occasion] || '👗'
  }
  
  export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }
  
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const generateImagePlaceholder = (width = 300, height = 300, text = 'Image') => {
    return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`
  }
  
  export const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }