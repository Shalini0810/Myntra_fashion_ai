class AIService {
  constructor() {
    this.baseURL = import.meta.env?.VITE_AI_API_URL || 'https://api.openai.com/v1'
    this.apiKey = import.meta.env?.VITE_OPENAI_API_KEY || null
    this.fashionDatabase = this.initializeFashionDatabase()
  }

  initializeFashionDatabase() {
    return [
      // Women's Ethnic Wear
      {
        id: 1,
        title: 'Elegant Silk Saree',
        description: 'Traditional silk saree perfect for weddings and festivals',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
        price: '₹8,999',
        originalPrice: '₹12,999',
        discount: '30% OFF',
        brand: 'Nalli',
        category: 'Sarees',
        colors: ['Red', 'Gold', 'Maroon'],
        tags: ['traditional', 'silk', 'wedding', 'festival'],
        occasions: ['wedding', 'festival'],
        rating: 4.8,
        inStock: true,
        buyLink: 'https://www.myntra.com/sarees'
      },
      {
        id: 2,
        title: 'Designer Anarkali Suit',
        description: 'Flowy Anarkali with intricate embroidery',
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop',
        price: '₹4,999',
        originalPrice: '₹7,999',
        brand: 'Biba',
        category: 'Suits',
        colors: ['Pink', 'Blue', 'Green'],
        tags: ['traditional', 'embroidered', 'party'],
        occasions: ['wedding', 'party', 'festival'],
        rating: 4.6,
        inStock: true,
        buyLink: 'https://www.myntra.com/suits'
      },
      // Western Wear
      {
        id: 3,
        title: 'Classic White Button Shirt',
        description: 'Crisp white shirt perfect for office and casual wear',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
        price: '₹1,999',
        originalPrice: '₹2,999',
        brand: 'H&M',
        category: 'Shirts',
        colors: ['White', 'Light Blue', 'Pink'],
        tags: ['professional', 'versatile', 'cotton'],
        occasions: ['work', 'casual', 'date'],
        rating: 4.5,
        inStock: true,
        buyLink: 'https://www.myntra.com/shirts'
      },
      {
        id: 4,
        title: 'High-Waisted Dark Jeans',
        description: 'Comfortable stretch jeans with perfect fit',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        price: '₹2,799',
        brand: 'Levi\'s',
        category: 'Jeans',
        colors: ['Dark Blue', 'Black'],
        tags: ['casual', 'comfortable', 'versatile'],
        occasions: ['casual', 'date', 'travel'],
        rating: 4.7,
        inStock: true,
        buyLink: 'https://www.myntra.com/jeans'
      },
      {
        id: 5,
        title: 'Professional Blazer',
        description: 'Tailored blazer for professional settings',
        image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=400&fit=crop',
        price: '₹5,999',
        brand: 'And',
        category: 'Blazers',
        colors: ['Black', 'Navy', 'Gray'],
        tags: ['professional', 'tailored', 'formal'],
        occasions: ['work'],
        rating: 4.8,
        inStock: true,
        buyLink: 'https://www.myntra.com/blazers'
      },
      {
        id: 6,
        title: 'Little Black Dress',
        description: 'Elegant dress perfect for parties and date nights',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
        price: '₹3,499',
        brand: 'Zara',
        category: 'Dresses',
        colors: ['Black'],
        tags: ['elegant', 'party', 'date'],
        occasions: ['party', 'date'],
        rating: 4.6,
        inStock: true,
        buyLink: 'https://www.myntra.com/dresses'
      },
      {
        id: 7,
        title: 'Floral Midi Dress',
        description: 'Feminine dress perfect for casual and semi-formal occasions',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
        price: '₹2,999',
        brand: 'Forever 21',
        category: 'Dresses',
        colors: ['Pink', 'Blue', 'Yellow'],
        tags: ['feminine', 'floral', 'casual'],
        occasions: ['casual', 'date', 'party'],
        rating: 4.4,
        inStock: true,
        buyLink: 'https://www.myntra.com/dresses'
      },
      // Footwear
      {
        id: 8,
        title: 'Comfortable Block Heels',
        description: 'Stylish yet comfortable heels for work',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
        price: '₹3,499',
        brand: 'Aldo',
        category: 'Footwear',
        colors: ['Black', 'Nude', 'Navy'],
        tags: ['professional', 'comfortable', 'heels'],
        occasions: ['work', 'party'],
        rating: 4.3,
        inStock: true,
        buyLink: 'https://www.myntra.com/heels'
      },
      {
        id: 9,
        title: 'White Sneakers',
        description: 'Versatile sneakers for casual and travel',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        price: '₹4,999',
        brand: 'Nike',
        category: 'Footwear',
        colors: ['White', 'Black'],
        tags: ['casual', 'comfortable', 'sporty'],
        occasions: ['casual', 'travel', 'gym'],
        rating: 4.6,
        inStock: true,
        buyLink: 'https://www.myntra.com/sneakers'
      },
      {
        id: 10,
        title: 'Ankle Boots',
        description: 'Trendy ankle boots for fall and winter',
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop',
        price: '₹6,999',
        brand: 'Zara',
        category: 'Footwear',
        colors: ['Brown', 'Black', 'Tan'],
        tags: ['trendy', 'winter', 'boots'],
        occasions: ['casual', 'work'],
        rating: 4.5,
        inStock: true,
        buyLink: 'https://www.myntra.com/boots'
      },
      // Accessories
      {
        id: 11,
        title: 'Gold Statement Necklace',
        description: 'Bold necklace to elevate any outfit',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
        price: '₹2,499',
        brand: 'Accessorize',
        category: 'Jewelry',
        colors: ['Gold'],
        tags: ['statement', 'traditional', 'party'],
        occasions: ['wedding', 'party', 'festival'],
        rating: 4.4,
        inStock: true,
        buyLink: 'https://www.myntra.com/jewelry'
      },
      {
        id: 12,
        title: 'Silver Drop Earrings',
        description: 'Elegant silver earrings for everyday wear',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
        price: '₹1,299',
        brand: 'Tanishq',
        category: 'Jewelry',
        colors: ['Silver'],
        tags: ['elegant', 'daily', 'silver'],
        occasions: ['work', 'casual', 'date'],
        rating: 4.7,
        inStock: true,
        buyLink: 'https://www.myntra.com/earrings'
      },
      {
        id: 13,
        title: 'Leather Handbag',
        description: 'Professional leather bag for work',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        price: '₹6,999',
        brand: 'Fossil',
        category: 'Bags',
        colors: ['Black', 'Brown', 'Tan'],
        tags: ['professional', 'leather', 'spacious'],
        occasions: ['work'],
        rating: 4.5,
        inStock: true,
        buyLink: 'https://www.myntra.com/handbags'
      },
      {
        id: 14,
        title: 'Crossbody Bag',
        description: 'Stylish crossbody bag for casual outings',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
        price: '₹2,799',
        brand: 'Michael Kors',
        category: 'Bags',
        colors: ['Black', 'Pink', 'White'],
        tags: ['casual', 'trendy', 'compact'],
        occasions: ['casual', 'travel', 'date'],
        rating: 4.6,
        inStock: true,
        buyLink: 'https://www.myntra.com/sling-bags'
      },
      // Tops & Blouses
      {
        id: 15,
        title: 'Silk Blouse',
        description: 'Luxurious silk blouse for special occasions',
        image: 'https://images.unsplash.com/photo-1566479179817-c0a6e0d5c1b6?w=400&h=400&fit=crop',
        price: '₹3,999',
        brand: 'AND',
        category: 'Tops',
        colors: ['Cream', 'Navy', 'Pink'],
        tags: ['silk', 'elegant', 'formal'],
        occasions: ['work', 'party', 'date'],
        rating: 4.5,
        inStock: true,
        buyLink: 'https://www.myntra.com/tops'
      },
      {
        id: 16,
        title: 'Casual Cotton T-Shirt',
        description: 'Soft cotton tee for everyday comfort',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: '₹999',
        brand: 'H&M',
        category: 'Tops',
        colors: ['White', 'Black', 'Gray', 'Pink'],
        tags: ['casual', 'cotton', 'basic'],
        occasions: ['casual', 'travel'],
        rating: 4.3,
        inStock: true,
        buyLink: 'https://www.myntra.com/tshirts'
      },
      // Jackets & Cardigans
      {
        id: 17,
        title: 'Denim Jacket',
        description: 'Classic denim jacket for layering',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        price: '₹3,799',
        brand: 'Levi\'s',
        category: 'Jackets',
        colors: ['Blue', 'Black', 'White'],
        tags: ['casual', 'denim', 'versatile'],
        occasions: ['casual', 'travel'],
        rating: 4.6,
        inStock: true,
        buyLink: 'https://www.myntra.com/jackets'
      },
      {
        id: 18,
        title: 'Knit Cardigan',
        description: 'Cozy knit cardigan for cooler weather',
        image: 'https://images.unsplash.com/photo-1544441893-675973e4cd3f?w=400&h=400&fit=crop',
        price: '₹2,999',
        brand: 'Zara',
        category: 'Cardigans',
        colors: ['Beige', 'Gray', 'Navy'],
        tags: ['cozy', 'knit', 'layering'],
        occasions: ['casual', 'work'],
        rating: 4.4,
        inStock: true,
        buyLink: 'https://www.myntra.com/cardigans'
      }
    ]
  }



  // Add this new method for occasion-based outfit generation
  async generateOccasionOutfits(context) {
    const { occasion, preferences, userProfile } = context
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      // Get occasion-specific rules
      const occasionRules = this.getOccasionRules(occasion)
      
      // Filter items suitable for the occasion
      let suitableItems = this.fashionDatabase.filter(item => {
        // Check if item is suitable for the occasion
        if (occasionRules.occasions && !item.occasions.some(occ => occasionRules.occasions.includes(occ))) {
          return false
        }
        
        // Check formality level
        if (occasionRules.formality && !occasionRules.formality.includes(item.formality)) {
          return false
        }
        
        // Check style preferences
        if (preferences.style && !item.tags.includes(preferences.style)) {
          return false
        }
        
        // Check color preferences
        if (preferences.colors && preferences.colors.length > 0) {
          const hasMatchingColor = item.colors.some(itemColor => 
            preferences.colors.some(prefColor => 
              itemColor.toLowerCase().includes(prefColor.toLowerCase())
            )
          )
          if (!hasMatchingColor) return false
        }
        
        return true
      })
      
      // Apply budget filter if specified
      if (preferences.budget) {
        suitableItems = this.filterByBudget(suitableItems, preferences.budget)
      }
      
      // If we don't have enough items, relax some constraints
      if (suitableItems.length < 5) {
        suitableItems = this.fashionDatabase.filter(item => 
          item.occasions.includes(occasion) || 
          (occasionRules.formality && occasionRules.formality.includes(item.formality))
        )
      }
      
      // Create complete outfits
      const outfits = this.createCompleteOutfits(suitableItems, occasion, preferences)
      
      return outfits
      
    } catch (error) {
      console.error('Error generating occasion outfits:', error)
      return this.getFallbackOutfits(occasion)
    }
  }

  // Helper method to get occasion-specific rules
  getOccasionRules(occasion) {
    const rules = {
      'wedding': {
        occasions: ['wedding', 'party', 'formal'],
        formality: ['formal', 'semi-formal'],
        avoidColors: ['white', 'ivory'],
        preferredStyles: ['elegant', 'traditional', 'romantic']
      },
      'party': {
        occasions: ['party', 'date'],
        formality: ['semi-formal', 'formal'],
        preferredStyles: ['trendy', 'elegant', 'glamorous']
      },
      'work': {
        occasions: ['work'],
        formality: ['formal', 'business-casual'],
        preferredStyles: ['professional', 'classic', 'minimalist']
      },
      'casual': {
        occasions: ['casual'],
        formality: ['casual', 'informal'],
        preferredStyles: ['casual', 'comfortable', 'relaxed']
      },
      'date': {
        occasions: ['date', 'party'],
        formality: ['semi-formal', 'casual'],
        preferredStyles: ['romantic', 'elegant', 'trendy']
      },
      'travel': {
        occasions: ['travel', 'casual'],
        formality: ['casual'],
        preferredStyles: ['comfortable', 'versatile', 'practical']
      },
      'festival': {
        occasions: ['festival', 'wedding'],
        formality: ['formal', 'semi-formal'],
        preferredStyles: ['traditional', 'colorful', 'festive']
      },
      'gym': {
        occasions: ['gym', 'sports'],
        formality: ['casual'],
        preferredStyles: ['sporty', 'comfortable', 'athletic']
      }
    }
    
    return rules[occasion] || rules['casual']
  }

  // Helper method to create complete outfits
  createCompleteOutfits(items, occasion, preferences) {
    const outfits = []
    
    // Group items by category
    const itemsByCategory = {
      tops: items.filter(item => ['tops', 'shirts', 'blouses'].includes(item.category.toLowerCase())),
      bottoms: items.filter(item => ['jeans', 'pants', 'skirts', 'bottoms'].includes(item.category.toLowerCase())),
      dresses: items.filter(item => item.category.toLowerCase() === 'dresses'),
      footwear: items.filter(item => item.category.toLowerCase() === 'footwear'),
      accessories: items.filter(item => ['jewelry', 'bags', 'accessories'].includes(item.category.toLowerCase())),
      outerwear: items.filter(item => ['blazers', 'jackets', 'cardigans'].includes(item.category.toLowerCase()))
    }
    
    // Create outfit combinations
    for (let i = 0; i < 3; i++) {
      const outfit = {
        id: Date.now() + i,
        items: [],
        totalPrice: 0,
        style: preferences.style || 'stylish',
        description: '',
        confidence: 0,
        stylingTips: []
      }
      
      // Strategy 1: Dress-based outfit
      if (itemsByCategory.dresses.length > 0 && Math.random() > 0.4) {
        const dress = itemsByCategory.dresses[Math.floor(Math.random() * itemsByCategory.dresses.length)]
        outfit.items.push(dress)
        
        // Add accessories
        if (itemsByCategory.accessories.length > 0) {
          const accessory = itemsByCategory.accessories[Math.floor(Math.random() * itemsByCategory.accessories.length)]
          outfit.items.push(accessory)
        }
        
        // Add footwear
        if (itemsByCategory.footwear.length > 0) {
          const shoes = itemsByCategory.footwear[Math.floor(Math.random() * itemsByCategory.footwear.length)]
          outfit.items.push(shoes)
        }
        
        // Add outerwear for formal occasions
        if (['wedding', 'work', 'party'].includes(occasion) && itemsByCategory.outerwear.length > 0) {
          const outerwear = itemsByCategory.outerwear[Math.floor(Math.random() * itemsByCategory.outerwear.length)]
          outfit.items.push(outerwear)
        }
        
        outfit.stylingTips = [
          `This ${dress.title.toLowerCase()} is perfect for ${occasion}`,
          'Complete the look with minimal jewelry for elegance',
          'Choose comfortable yet stylish footwear'
        ]
      }
      // Strategy 2: Separates-based outfit
      else {
        // Add top
        if (itemsByCategory.tops.length > 0) {
          const top = itemsByCategory.tops[Math.floor(Math.random() * itemsByCategory.tops.length)]
          outfit.items.push(top)
        }
        
        // Add bottom
        if (itemsByCategory.bottoms.length > 0) {
          const bottom = itemsByCategory.bottoms[Math.floor(Math.random() * itemsByCategory.bottoms.length)]
          outfit.items.push(bottom)
        }
        
        // Add footwear
        if (itemsByCategory.footwear.length > 0) {
          const shoes = itemsByCategory.footwear[Math.floor(Math.random() * itemsByCategory.footwear.length)]
          outfit.items.push(shoes)
        }
        
        // Add outerwear for professional/formal occasions
        if (['work', 'wedding', 'party'].includes(occasion) && itemsByCategory.outerwear.length > 0) {
          const outerwear = itemsByCategory.outerwear[Math.floor(Math.random() * itemsByCategory.outerwear.length)]
          outfit.items.push(outerwear)
        }
        
        // Add accessories
        if (itemsByCategory.accessories.length > 0) {
          const accessory = itemsByCategory.accessories[Math.floor(Math.random() * itemsByCategory.accessories.length)]
          outfit.items.push(accessory)
        }
        
        outfit.stylingTips = [
          'Layer pieces for a sophisticated look',
          'Mix textures for visual interest',
          'Coordinate colors for a cohesive outfit'
        ]
      }
      
      // Calculate total price and confidence
      outfit.totalPrice = outfit.items.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[₹,]/g, ''))
        return sum + price
      }, 0)
      
      outfit.confidence = Math.floor(Math.random() * 15) + 85
      outfit.description = this.generateOutfitDescription(outfit, occasion)
      
      // Only add outfit if it has at least 2 items
      if (outfit.items.length >= 2) {
        outfits.push(outfit)
      }
    }
    
    return outfits.length > 0 ? outfits : this.getFallbackOutfits(occasion)
  }

  // Helper method to generate outfit descriptions
  generateOutfitDescription(outfit, occasion) {
    const occasionDescriptions = {
      'wedding': 'Elegant and respectful attire perfect for wedding celebrations',
      'party': 'Stylish and trendy look that will make you stand out',
      'work': 'Professional and polished outfit for the workplace',
      'casual': 'Comfortable yet stylish for everyday wear',
      'date': 'Romantic and charming look perfect for special moments',
      'travel': 'Comfortable and practical outfit for your journey',
      'festival': 'Traditional and festive attire for celebrations',
      'gym': 'Comfortable and functional workout wear'
    }
    
    return occasionDescriptions[occasion] || 'A perfectly curated outfit for your occasion'
  }

  // Fallback outfits when main algorithm fails
  getFallbackOutfits(occasion) {
    const fallbackItems = this.fashionDatabase.slice(0, 8)
    
    return [{
      id: Date.now(),
      items: fallbackItems.slice(0, 3),
      totalPrice: 5000,
      style: 'classic',
      description: `A classic ${occasion} outfit curated just for you`,
      confidence: 80,
      stylingTips: [
        'Classic pieces never go out of style',
        'Focus on fit and comfort',
        'Add personal touches with accessories'
      ]
    }]
  }


  // Image Analysis Method
  async analyzeStyleImage(imageFile, context) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock image analysis with varied responses
    const analyses = [
      {
        analysis: 'Traditional Indian saree with rich embroidery and vibrant colors',
        confidence: 92,
        detectedItems: [
          { type: 'saree', color: 'red', style: 'traditional', confidence: 95 },
          { type: 'blouse', color: 'gold', style: 'embroidered', confidence: 88 }
        ],
        dominantColors: ['red', 'gold', 'maroon'],
        style: 'traditional',
        occasion: 'wedding'
      },
      {
        analysis: 'Professional western outfit with clean lines and neutral tones',
        confidence: 88,
        detectedItems: [
          { type: 'blazer', color: 'navy', style: 'professional', confidence: 92 },
          { type: 'shirt', color: 'white', style: 'formal', confidence: 90 },
          { type: 'trousers', color: 'black', style: 'tailored', confidence: 85 }
        ],
        dominantColors: ['navy', 'white', 'black'],
        style: 'professional',
        occasion: 'work'
      },
      {
        analysis: 'Casual party dress with modern silhouette',
        confidence: 85,
        detectedItems: [
          { type: 'dress', color: 'black', style: 'party', confidence: 90 }
        ],
        dominantColors: ['black'],
        style: 'party',
        occasion: 'party'
      },
      {
        analysis: 'Floral summer dress with feminine details',
        confidence: 87,
        detectedItems: [
          { type: 'dress', color: 'floral', style: 'feminine', confidence: 89 }
        ],
        dominantColors: ['pink', 'white', 'green'],
        style: 'feminine',
        occasion: 'casual'
      },
      {
        analysis: 'Denim jeans with casual styling',
        confidence: 83,
        detectedItems: [
          { type: 'jeans', color: 'blue', style: 'casual', confidence: 91 }
        ],
        dominantColors: ['blue', 'denim'],
        style: 'casual',
        occasion: 'casual'
      },
      {
        analysis: 'Elegant silk top with sophisticated styling',
        confidence: 89,
        detectedItems: [
          { type: 'top', color: 'cream', style: 'elegant', confidence: 87 }
        ],
        dominantColors: ['cream', 'beige'],
        style: 'elegant',
        occasion: 'work'
      }
    ]
    
    return analyses[Math.floor(Math.random() * analyses.length)]
  }

  // Main Chat Processing Method
  async processImageMatchingChat(context) {
    const { message, imageAnalysis, conversationHistory } = context
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const lowerMessage = message.toLowerCase()
    let reply = ""
    let matchingItems = []
    
    // Analyze what user is asking for
    const requestedItems = this.parseUserRequest(lowerMessage, imageAnalysis)
    
    if (requestedItems.categories.length > 0) {
      // Find matching items based on request
      matchingItems = await this.findSpecificMatches(requestedItems, imageAnalysis)
      
      // Generate contextual reply
      reply = this.generateContextualReply(requestedItems, matchingItems, imageAnalysis)
    } else {
      // General styling advice
      reply = this.generateGeneralAdvice(lowerMessage, imageAnalysis)
      
      // If user is asking for general recommendations, show some items
      if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('show')) {
        matchingItems = await this.findGeneralMatches(imageAnalysis)
      }
    }
    
    return {
      reply,
      matchingItems: matchingItems.slice(0, 6) // Limit to 6 items
    }
  }

  // Parse user request to understand what they want
  parseUserRequest(message, analysis) {
    const categoryMap = {
      'top': ['Shirts', 'Tops', 'Blouses'],
      'tops': ['Shirts', 'Tops', 'Blouses'],
      'shirt': ['Shirts'],
      'blouse': ['Tops'],
      'bottom': ['Jeans', 'Pants', 'Skirts', 'Trousers'],
      'bottoms': ['Jeans', 'Pants', 'Skirts', 'Trousers'],
      'jeans': ['Jeans'],
      'pants': ['Jeans', 'Pants'],
      'skirt': ['Skirts'],
      'dress': ['Dresses'],
      'dresses': ['Dresses'],
      'shoe': ['Footwear'],
      'shoes': ['Footwear'],
      'footwear': ['Footwear'],
      'heels': ['Footwear'],
      'sneakers': ['Footwear'],
      'boots': ['Footwear'],
      'accessory': ['Jewelry', 'Bags', 'Accessories'],
      'accessories': ['Jewelry', 'Bags', 'Accessories'],
      'jewelry': ['Jewelry'],
      'jewellery': ['Jewelry'],
      'necklace': ['Jewelry'],
      'earrings': ['Jewelry'],
      'bag': ['Bags'],
      'bags': ['Bags'],
      'handbag': ['Bags'],
      'purse': ['Bags'],
      'jacket': ['Blazers', 'Jackets', 'Cardigans'],
      'jackets': ['Blazers', 'Jackets', 'Cardigans'],
      'blazer': ['Blazers'],
      'cardigan': ['Cardigans']
    }
    
    const occasionMap = {
      'party': 'party',
      'parties': 'party',
      'work': 'work',
      'office': 'work',
      'professional': 'work',
      'wedding': 'wedding',
      'weddings': 'wedding',
      'casual': 'casual',
      'date': 'date',
      'gym': 'gym',
      'workout': 'gym',
      'festival': 'festival'
    }
    
    let categories = []
    let occasions = []
    let colors = []
    let style = null
    
    // Extract categories
    Object.keys(categoryMap).forEach(key => {
      if (message.includes(key)) {
        categories.push(...categoryMap[key])
      }
    })
    
    // Extract occasions
    Object.keys(occasionMap).forEach(key => {
      if (message.includes(key)) {
        occasions.push(occasionMap[key])
      }
    })
    
    // Extract colors
    const colorKeywords = ['red', 'blue', 'black', 'white', 'pink', 'green', 'yellow', 'purple', 'orange', 'navy', 'gold', 'silver', 'brown', 'gray', 'beige']
    colorKeywords.forEach(color => {
      if (message.includes(color)) {
        colors.push(color)
      }
    })
    
    // Extract style preferences
    if (message.includes('formal') || message.includes('professional')) {
      style = 'professional'
    } else if (message.includes('casual') || message.includes('relaxed')) {
      style = 'casual'
    } else if (message.includes('trendy') || message.includes('modern')) {
      style = 'trendy'
    } else if (message.includes('traditional')) {
      style = 'traditional'
    } else if (message.includes('elegant')) {
      style = 'elegant'
    }
    
    return {
      categories: [...new Set(categories)], // Remove duplicates
      occasions,
      colors,
      style
    }
  }

  // Find specific matches based on user request
  async findSpecificMatches(request, imageAnalysis) {
    const { categories, occasions, colors, style } = request
    
    let filteredItems = this.fashionDatabase.filter(item => {
      // Filter by requested categories
      if (categories.length > 0 && !categories.includes(item.category)) {
        return false
      }
      
      // Filter by occasions if specified
      if (occasions.length > 0 && !occasions.some(occ => item.occasions.includes(occ))) {
        return false
      }
      
      // Filter by colors if specified
      if (colors.length > 0 && !colors.some(color => 
        item.colors.some(itemColor => itemColor.toLowerCase().includes(color))
      )) {
        return false
      }
      
      // Filter by style if specified
      if (style && !item.tags.includes(style)) {
        return false
      }
      
      return true
    })
    
    // If no specific matches, find complementary items
    if (filteredItems.length === 0 && categories.length > 0) {
      filteredItems = this.findComplementaryItems(categories[0], imageAnalysis)
    }
    
    // Add match scores and reasons
    return filteredItems.map(item => ({
      ...item,
      matchScore: this.calculateMatchScore(item, imageAnalysis),
      reason: this.generateMatchReason(item, request, imageAnalysis)
    })).sort((a, b) => b.matchScore - a.matchScore)
  }

  // Find general matches when no specific category is requested
  async findGeneralMatches(imageAnalysis) {
    const detectedItem = imageAnalysis.detectedItems?.[0]
    const detectedCategory = this.mapDetectedItemToCategory(detectedItem?.type)
    
    // Find complementary items for the detected category
    let complementaryItems = []
    if (detectedCategory) {
      complementaryItems = this.findComplementaryItems(detectedCategory, imageAnalysis)
    }
    
    // If no complementary items found, show popular items
    if (complementaryItems.length === 0) {
      complementaryItems = this.fashionDatabase
        .filter(item => item.rating >= 4.4)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
    }
    
    return complementaryItems.map(item => ({
      ...item,
      matchScore: this.calculateMatchScore(item, imageAnalysis),
      reason: `Great complement to your ${detectedItem?.type || 'outfit'}`
    }))
  }

  // Map detected items to categories
  mapDetectedItemToCategory(detectedType) {
    const mapping = {
      'saree': 'Sarees',
      'dress': 'Dresses',
      'shirt': 'Shirts',
      'top': 'Tops',
      'jeans': 'Jeans',
      'blazer': 'Blazers',
      'skirt': 'Skirts'
    }
    return mapping[detectedType?.toLowerCase()] || null
  }

  // Find complementary items for a category
  findComplementaryItems(category, imageAnalysis) {
    const complementaryMap = {
      'Sarees': ['Jewelry', 'Footwear', 'Bags'],
      'Dresses': ['Footwear', 'Jewelry', 'Bags', 'Jackets'],
      'Shirts': ['Jeans', 'Pants', 'Skirts', 'Blazers', 'Bags'],
      'Tops': ['Jeans', 'Pants', 'Skirts', 'Jackets', 'Bags'],
      'Jeans': ['Shirts', 'Tops', 'Blazers', 'Jackets', 'Footwear'],
      'Pants': ['Shirts', 'Tops', 'Blazers', 'Jackets', 'Footwear'],
      'Skirts': ['Shirts', 'Tops', 'Blazers', 'Footwear'],
      'Blazers': ['Shirts', 'Tops', 'Pants', 'Skirts'],
      'Footwear': ['Jeans', 'Dresses', 'Skirts', 'Pants'],
      'Jewelry': ['Dresses', 'Shirts', 'Tops', 'Sarees'],
      'Bags': ['any']
    }
    
    const complementaryCategories = complementaryMap[category] || []
    
    return this.fashionDatabase.filter(item => {
      if (complementaryCategories.includes('any')) return true
      return complementaryCategories.includes(item.category)
    })
  }

  // Calculate match score for items
  calculateMatchScore(item, analysis) {
    let score = 60 // Base score
    
    // Occasion match
    if (analysis.occasion && item.occasions.includes(analysis.occasion)) {
      score += 25
    }
    
    // Style match
    if (analysis.style && item.tags.includes(analysis.style)) {
      score += 20
    }
    
    // Color match
    if (analysis.dominantColors && item.colors.some(color => 
      analysis.dominantColors.some(detectedColor => 
        color.toLowerCase().includes(detectedColor.toLowerCase())
      )
    )) {
      score += 15
    }
    
    // High rating bonus
    if (item.rating >= 4.5) score += 5
    if (item.rating >= 4.7) score += 3
    
    // In stock bonus
    if (item.inStock) score += 2
    
    return Math.min(score, 98)
  }

  // Generate contextual replies
  generateContextualReply(request, matchingItems, imageAnalysis) {
    const { categories, occasions, colors } = request
    const detectedItem = imageAnalysis.detectedItems?.[0]?.type || 'item'
    
    if (matchingItems.length === 0) {
      return `I couldn't find specific ${categories.join(' or ')} that match your ${detectedItem} right now. Let me show you some general recommendations that would work well together!`
    }
    
    let reply = `Perfect! I found ${matchingItems.length} amazing ${categories.join(' and ')} that would look fantastic with your ${detectedItem}. `
    
    if (occasions.length > 0) {
      reply += `These are specially curated for ${occasions.join(' and ')} occasions. `
    }
    
    if (colors.length > 0) {
      reply += `I focused on ${colors.join(' and ')} tones as you requested. `
    }
    
    reply += "Check out my recommendations below! 👇"
    
    return reply
  }

  // Generate general styling advice
  generateGeneralAdvice(message, imageAnalysis) {
    const detectedItem = imageAnalysis.detectedItems?.[0]?.type || 'piece'
    const dominantColor = imageAnalysis.dominantColors?.[0] || 'color'
    const occasion = imageAnalysis.occasion || 'any occasion'
    
    if (message.includes('complete') || message.includes('full look') || message.includes('entire')) {
      return `To complete your look with this ${detectedItem}, I'd suggest adding complementary pieces that work with the ${dominantColor} tones. Let me find some perfect matches for you!`
    }
    
    if (message.includes('style') || message.includes('how')) {
      return `This ${detectedItem} is quite versatile! You can style it in many ways depending on the occasion. The ${dominantColor} color gives us great styling options. What specific look are you going for?`
    }
    
    if (message.includes('color') || message.includes('match') || message.includes('coordinate')) {
      return `The ${dominantColor} in your ${detectedItem} works beautifully with many complementary colors! I can help you find pieces that will create a perfectly coordinated outfit.`
    }
    
    if (message.includes('occasion') || message.includes('wear') || message.includes('event')) {
      return `This ${detectedItem} is perfect for ${occasion}! Let me suggest some pieces that will help you create the ideal look for your event.`
    }
    
    if (message.includes('accessory') || message.includes('accessories')) {
      return `Great question! Accessories can totally transform your ${detectedItem}. Let me show you some jewelry, bags, and other accessories that would enhance your look!`
    }
    
    if (message.includes('budget') || message.includes('affordable') || message.includes('cheap')) {
      return `I understand budget is important! Let me find you some affordable pieces that still look amazing with your ${detectedItem}. Great style doesn't have to be expensive!`
    }
    
    // Default responses
    const defaultResponses = [
      `I'd love to help you style this beautiful ${detectedItem}! You can ask me to find specific items like tops, bottoms, shoes, or accessories. What would you like to see?`,
      `This ${detectedItem} has great potential! Tell me what you're looking for - maybe shoes, jewelry, or a complete outfit for a specific occasion?`,
      `Beautiful choice! I can help you find matching pieces, accessories, or create a complete look. What are you in the mood for?`,
      `Love this ${detectedItem}! Whether you need something casual or formal, I can help you put together the perfect outfit. What's the occasion?`
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  // Generate match reasons
  generateMatchReason(item, request, imageAnalysis) {
    const reasons = []
    
    if (request.categories.includes(item.category)) {
      reasons.push(`Perfect ${item.category.toLowerCase()} match`)
    }
    
    if (request.occasions.some(occ => item.occasions.includes(occ))) {
      const matchedOccasion = request.occasions.find(occ => item.occasions.includes(occ))
      reasons.push(`Ideal for ${matchedOccasion} events`)
    }
    
    if (request.colors.some(color => 
      item.colors.some(itemColor => itemColor.toLowerCase().includes(color.toLowerCase()))
    )) {
      reasons.push(`Matches your requested colors`)
    }
    
    if (imageAnalysis.dominantColors?.some(detectedColor =>
      item.colors.some(itemColor => itemColor.toLowerCase().includes(detectedColor.toLowerCase()))
    )) {
      reasons.push(`Complements the colors in your outfit`)
    }
    
    if (item.rating >= 4.5) {
      reasons.push(`Highly rated by customers (${item.rating}★)`)
    }
    
    if (item.tags.includes('versatile')) {
      reasons.push(`Versatile piece that works with multiple styles`)
    }
    
    return reasons.length > 0 
      ? reasons.slice(0, 2).join(' and ') 
      : 'AI recommended based on style compatibility'
  }

  // Additional helper methods for existing functionality
  async getStyleRecommendations(context) {
    try {
      const recommendations = await this.getPersonalizedRecommendations(context)
      return recommendations
    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackRecommendations(context)
    }
  }

  async getPersonalizedRecommendations(context) {
    const { styleProfile, wardrobe = [], userProfile = {} } = context
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    let filteredItems = [...this.fashionDatabase]
    
    // Apply filters based on context
    if (styleProfile?.style) {
      filteredItems = filteredItems.filter(item => 
        item.tags.includes(styleProfile.style)
      )
    }
    
    if (styleProfile?.budget) {
      filteredItems = this.filterByBudget(filteredItems, styleProfile.budget)
    }
    
    // Ensure we have at least 3 items
    if (filteredItems.length < 3) {
      filteredItems = this.fashionDatabase.sort((a, b) => b.rating - a.rating).slice(0, 6)
    }
    
    return filteredItems
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map(item => ({
        ...item,
        confidence: Math.floor(Math.random() * 20) + 80,
        reason: 'Selected based on your preferences'
      }))
  }

  filterByBudget(items, budget) {
    const budgetRanges = {
      'under-1000': [0, 1000],
      '1000-3000': [1000, 3000],
      '3000-5000': [3000, 5000],
      '5000-10000': [5000, 10000],
      'above-10000': [10000, 999999]
    }
    
    const [min, max] = budgetRanges[budget] || [0, 999999]
    
    return items.filter(item => {
      const price = parseInt(item.price.replace(/[₹,]/g, ''))
      return price >= min && price <= max
    })
  }

  getFallbackRecommendations(context) {
    return this.fashionDatabase.slice(0, 3).map(item => ({
      ...item,
      confidence: 85,
      reason: 'Popular choice'
    }))
  }

  // Wishlist functionality
  async getWishlistItems() {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return a subset of items as wishlist
    return this.fashionDatabase.slice(0, 8).map(item => ({
      ...item,
      addedToWishlist: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }))
  }

  async findWishlistPairings(selectedItem) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const pairings = []
    const { category, occasions, colors, tags } = selectedItem
    
    // Find complementary items
    this.fashionDatabase.forEach(item => {
      if (item.id === selectedItem.id) return
      
      let compatibility = 0
      let pairingReason = ''
      
      // Category-based pairing logic
      if (category === 'Sarees' && item.category === 'Jewelry') {
        compatibility = 95
        pairingReason = 'Perfect jewelry to complement your saree'
      } else if (category === 'Shirts' && item.category === 'Jeans') {
        compatibility = 90
        pairingReason = 'Classic shirt and jeans combination'
      } else if (category === 'Blazers' && (item.category === 'Shirts' || item.category === 'Bags')) {
        compatibility = 88
        pairingReason = 'Essential for completing your professional look'
      } else if (category === 'Dresses' && (item.category === 'Footwear' || item.category === 'Jewelry')) {
        compatibility = 85
        pairingReason = 'Perfect accessories to enhance your dress'
      } else if (occasions.some(occ => item.occasions.includes(occ))) {
        compatibility = 80
        pairingReason = `Great for ${occasions.find(occ => item.occasions.includes(occ))} occasions`
      }
      
      if (compatibility > 0) {
        pairings.push({
          ...item,
          compatibility,
          pairingReason
        })
      }
    })
    
    return pairings.sort((a, b) => b.compatibility - a.compatibility).slice(0, 6)
  }
}

export const aiService = new AIService()