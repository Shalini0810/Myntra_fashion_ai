// Mock implementation for development
export const userService = {
    login: async (userData) => {
      // Mock login
      return {
        id: 'user_123',
        name: userData.name || 'Demo User',
        email: userData.email || 'demo@myntra.com',
        token: 'mock_token_123'
      }
    },
  
    register: async (userData) => {
      // Mock register
      return {
        id: 'user_123',
        name: userData.name,
        email: userData.email,
        token: 'mock_token_123'
      }
    },
  
    getProfile: async (userId) => {
      // Mock profile data
      const savedProfile = localStorage.getItem(`profile_${userId}`)
      if (savedProfile) {
        return JSON.parse(savedProfile)
      }
      return null
    },
  
    updateProfile: async (userId, profileData) => {
      // Mock update profile
      const profile = {
        ...profileData,
        id: userId,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile))
      return profile
    },
  
    getWardrobe: async (userId) => {
      // Mock wardrobe data
      const savedWardrobe = localStorage.getItem(`wardrobe_${userId}`)
      if (savedWardrobe) {
        return JSON.parse(savedWardrobe)
      }
      return []
    },
  
    addToWardrobe: async (userId, item) => {
      // Mock add to wardrobe
      const wardrobe = await userService.getWardrobe(userId)
      const newItem = {
        ...item,
        id: Date.now(),
        addedAt: new Date().toISOString()
      }
      wardrobe.push(newItem)
      localStorage.setItem(`wardrobe_${userId}`, JSON.stringify(wardrobe))
      return newItem
    },
  
    uploadWardrobeImage: async (userId, formData) => {
      // Mock image upload
      return {
        id: Date.now(),
        name: 'Uploaded Item',
        category: formData.get('category') || 'tops',
        imageUrl: 'https://via.placeholder.com/300x300?text=Wardrobe+Item',
        addedAt: new Date().toISOString()
      }
    }
  }