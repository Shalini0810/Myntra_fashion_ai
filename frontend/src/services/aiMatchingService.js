// src/services/aiMatchingService.js
import { fashionCollection } from '../data/fashionCollection'

class AIMatchingService {
  constructor() {
    this.collection = fashionCollection
  }

  // Image-Based Matching
  async analyzeImageAndFindMatches(imageFile) {
    // Simulate AI image analysis
    await this.simulateProcessing(2000)
    
    // Mock image analysis - in real app, this would use computer vision
    const detectedFeatures = this.mockImageAnalysis(imageFile)
    
    // Find matching items based on detected features
    const matches = this.findMatchingItems(detectedFeatures)
    
    return {
      detectedFeatures,
      matches: matches.slice(0, 6), // Top 6 matches
      confidence: Math.random() * 20 + 80 // 80-100% confidence
    }
  }

  // Wishlist Pairing
  async findComplementaryItems(wishlistItem) {
    await this.simulateProcessing(1500)
    
    const complementaryItems = this.collection.filter(item => {
      // Don't include the same item
      if (item.id === wishlistItem.id) return false
      
      // Find items that complement the wishlist item
      return this.areItemsComplementary(wishlistItem, item)
    })

    // Sort by compatibility score
    const scoredItems = complementaryItems.map(item => ({
      ...item,
      compatibilityScore: this.calculateCompatibilityScore(wishlistItem, item),
      pairingReason: this.generatePairingReason(wishlistItem, item)
    }))

    return scoredItems
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 8)
  }

  // Occasion-Based Styling
  async curateOutfitForOccasion(occasion, preferences = {}) {
    await this.simulateProcessing(2500)
    
    const occasionRules = this.getOccasionRules(occasion)
    
    // Filter items suitable for the occasion
    const suitableItems = this.collection.filter(item => 
      this.isItemSuitableForOccasion(item, occasionRules)
    )

    // Create complete outfit combinations
    const outfits = this.createOutfitCombinations(suitableItems, occasionRules, preferences)
    
    return outfits.slice(0, 3) // Return top 3 complete outfits
  }

  // Helper Methods
  mockImageAnalysis(imageFile) {
    // Mock analysis results - in real app, use TensorFlow.js or external API
    const possibleAnalyses = [
      {
        dominantColors: ['navy', 'white', 'blue'],
        detectedItems: ['shirt', 'casual'],
        style: 'casual',
        formality: 'informal',
        season: 'all-season'
      },
      {
        dominantColors: ['black', 'white', 'gray'],
        detectedItems: ['blazer', 'formal'],
        style: 'professional',
        formality: 'formal',
        season: 'all-season'
      },
      {
        dominantColors: ['red', 'pink', 'floral'],
        detectedItems: ['dress', 'feminine'],
        style: 'romantic',
        formality: 'semi-formal',
        season: 'spring'
      },
      {
        dominantColors: ['denim', 'blue', 'casual'],
        detectedItems: ['jeans', 'casual'],
        style: 'casual',
        formality: 'informal',
        season: 'all-season'
      }
    ]
    
    return possibleAnalyses[Math.floor(Math.random() * possibleAnalyses.length)]
  }

  findMatchingItems(detectedFeatures) {
    return this.collection.filter(item => {
      let score = 0
      
      // Color matching
      if (detectedFeatures.dominantColors.some(color => 
        item.colors.some(itemColor => 
          itemColor.toLowerCase().includes(color.toLowerCase())
        )
      )) {
        score += 30
      }
      
      // Style matching
      if (item.style.toLowerCase() === detectedFeatures.style.toLowerCase()) {
        score += 25
      }
      
      // Category matching
      if (detectedFeatures.detectedItems.some(detected => 
        item.category.toLowerCase().includes(detected.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(detected.toLowerCase()))
      )) {
        score += 20
      }
      
      // Formality matching
      if (item.formality === detectedFeatures.formality) {
        score += 15
      }
      
      return score > 40 // Minimum threshold
    })
  }

  areItemsComplementary(item1, item2) {
    // Different categories that work well together
    const complementaryCategories = {
      'tops': ['bottoms', 'jeans', 'skirts', 'pants'],
      'jeans': ['tops', 'shirts', 'blazers', 'sweaters'],
      'dresses': ['jackets', 'cardigans', 'blazers', 'accessories'],
      'skirts': ['tops', 'shirts', 'blouses', 'sweaters'],
      'blazers': ['tops', 'shirts', 'pants', 'skirts', 'jeans'],
      'accessories': ['tops', 'dresses', 'outerwear']
    }

    const category1 = item1.category.toLowerCase()
    const category2 = item2.category.toLowerCase()
    
    // Check if categories are complementary
    if (complementaryCategories[category1]?.includes(category2) ||
        complementaryCategories[category2]?.includes(category1)) {
      return true
    }

    // Check if they're in the same style family
    if (item1.style === item2.style) {
      return true
    }

    // Check color compatibility
    return this.areColorsCompatible(item1.colors, item2.colors)
  }

  calculateCompatibilityScore(item1, item2) {
    let score = 50 // Base score
    
    // Style compatibility
    if (item1.style === item2.style) score += 20
    
    // Color compatibility
    if (this.areColorsCompatible(item1.colors, item2.colors)) score += 15
    
    // Formality level match
    if (item1.formality === item2.formality) score += 10
    
    // Season compatibility
    if (item1.season === item2.season || 
        item1.season === 'all-season' || 
        item2.season === 'all-season') score += 5
    
    return Math.min(score, 100)
  }

  areColorsCompatible(colors1, colors2) {
    const neutrals = ['black', 'white', 'gray', 'beige', 'navy', 'cream']
    const compatiblePairs = [
      ['blue', 'white'], ['black', 'white'], ['navy', 'cream'],
      ['red', 'black'], ['pink', 'gray'], ['green', 'beige']
    ]
    
    // Check if any color from item1 is neutral or compatible with item2
    return colors1.some(color1 => 
      neutrals.includes(color1.toLowerCase()) ||
      colors2.some(color2 => 
        neutrals.includes(color2.toLowerCase()) ||
        compatiblePairs.some(pair => 
          (pair.includes(color1.toLowerCase()) && pair.includes(color2.toLowerCase()))
        )
      )
    )
  }

  generatePairingReason(item1, item2) {
    const reasons = [
      `Perfect color harmony between ${item1.colors[0]} and ${item2.colors[0]}`,
      `Both pieces share the same ${item1.style} aesthetic`,
      `Great for creating a balanced ${item1.formality} look`,
      `These items complement each other beautifully`,
      `Creates a cohesive outfit with excellent proportions`,
      `The textures and styles work harmoniously together`
    ]
    
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  getOccasionRules(occasion) {
    const rules = {
      'wedding': {
        formality: ['formal', 'semi-formal'],
        avoidColors: ['white', 'ivory'],
        preferredStyles: ['elegant', 'romantic', 'classic'],
        categories: ['dresses', 'formal wear', 'accessories', 'heels']
      },
      'work': {
        formality: ['formal', 'business-casual'],
        preferredColors: ['navy', 'black', 'gray', 'white'],
        preferredStyles: ['professional', 'classic', 'minimalist'],
        categories: ['blazers', 'shirts', 'pants', 'skirts', 'formal shoes']
      },
      'casual-date': {
        formality: ['casual', 'semi-formal'],
        preferredStyles: ['romantic', 'trendy', 'feminine'],
        categories: ['dresses', 'tops', 'jeans', 'casual shoes', 'accessories']
      },
      'party': {
        formality: ['semi-formal', 'formal'],
        preferredStyles: ['glamorous', 'trendy', 'bold'],
        categories: ['dresses', 'party wear', 'heels', 'accessories']
      },
      'vacation': {
        formality: ['casual'],
        preferredStyles: ['relaxed', 'comfortable', 'bohemian'],
        categories: ['casual wear', 'sandals', 'sundresses', 'accessories']
      }
    }
    
    return rules[occasion.toLowerCase()] || rules['casual-date']
  }

  isItemSuitableForOccasion(item, rules) {
    // Check formality
    if (rules.formality && !rules.formality.includes(item.formality)) {
      return false
    }
    
    // Check avoided colors
    if (rules.avoidColors && 
        item.colors.some(color => 
          rules.avoidColors.includes(color.toLowerCase())
        )) {
      return false
    }
    
    // Check preferred styles
    if (rules.preferredStyles && 
        !rules.preferredStyles.includes(item.style.toLowerCase())) {
      return false
    }
    
    return true
  }

  createOutfitCombinations(items, rules, preferences) {
    const outfits = []
    
    // Group items by category
    const itemsByCategory = items.reduce((acc, item) => {
      const category = item.category.toLowerCase()
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    }, {})

    // Create outfit combinations
    for (let i = 0; i < 3; i++) {
      const outfit = this.createSingleOutfit(itemsByCategory, rules, preferences)
      if (outfit.items.length >= 3) { // Minimum 3 items for complete outfit
        outfits.push(outfit)
      }
    }
    
    return outfits
  }

  createSingleOutfit(itemsByCategory, rules, preferences) {
    const outfit = {
      id: Date.now() + Math.random(),
      items: [],
      totalPrice: 0,
      style: '',
      description: '',
      confidence: 0
    }

    // Add main piece (dress or top)
    if (itemsByCategory.dresses && Math.random() > 0.5) {
      const dress = itemsByCategory.dresses[Math.floor(Math.random() * itemsByCategory.dresses.length)]
      outfit.items.push(dress)
      outfit.style = dress.style
    } else if (itemsByCategory.tops) {
      const top = itemsByCategory.tops[Math.floor(Math.random() * itemsByCategory.tops.length)]
      outfit.items.push(top)
      outfit.style = top.style
      
      // Add bottom
      if (itemsByCategory.bottoms || itemsByCategory.jeans || itemsByCategory.skirts) {
        const bottomCategories = [
          ...(itemsByCategory.bottoms || []),
          ...(itemsByCategory.jeans || []),
          ...(itemsByCategory.skirts || [])
        ]
        const bottom = bottomCategories[Math.floor(Math.random() * bottomCategories.length)]
        outfit.items.push(bottom)
      }
    }

    // Add outer layer
    if (itemsByCategory.blazers && Math.random() > 0.3) {
      const blazer = itemsByCategory.blazers[Math.floor(Math.random() * itemsByCategory.blazers.length)]
      outfit.items.push(blazer)
    }

    // Add shoes
    if (itemsByCategory.footwear) {
      const shoes = itemsByCategory.footwear[Math.floor(Math.random() * itemsByCategory.footwear.length)]
      outfit.items.push(shoes)
    }

    // Add accessories
    if (itemsByCategory.accessories && Math.random() > 0.4) {
      const accessory = itemsByCategory.accessories[Math.floor(Math.random() * itemsByCategory.accessories.length)]
      outfit.items.push(accessory)
    }

    // Calculate totals
    outfit.totalPrice = outfit.items.reduce((sum, item) => {
      const price = parseInt(item.price.replace(/[₹,]/g, ''))
      return sum + price
    }, 0)

    outfit.confidence = Math.random() * 15 + 85 // 85-100%
    outfit.description = this.generateOutfitDescription(outfit)

    return outfit
  }

  generateOutfitDescription(outfit) {
    const styles = outfit.items.map(item => item.style)
    const dominantStyle = styles[0] || 'stylish'
    
    const descriptions = [
      `A ${dominantStyle} ensemble perfect for the occasion`,
      `Carefully curated ${dominantStyle} look with perfect color coordination`,
      `${dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1)} outfit that makes a statement`,
      `Beautifully balanced look combining comfort and style`,
      `Sophisticated combination with attention to detail`
    ]
    
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  simulateProcessing(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
  }
}

export const aiMatchingService = new AIMatchingService()