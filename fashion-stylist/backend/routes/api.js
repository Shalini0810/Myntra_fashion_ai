import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Enhanced mock data for better testing
const fashionCollection = [
  {
    id: 1,
    name: "Elegant Black Blazer",
    price: 129.99,
    image: "https://via.placeholder.com/300x400?text=Black+Blazer&bg=000000&color=ffffff",
    description: "Perfect for formal business meetings and professional events",
    category: "formal",
    tags: ["business", "formal", "professional"]
  },
  {
    id: 2,
    name: "Classic Blue Jeans",
    price: 79.99,
    image: "https://via.placeholder.com/300x400?text=Blue+Jeans&bg=4169E1&color=ffffff",
    description: "Comfortable everyday wear for casual outings",
    category: "casual",
    tags: ["casual", "everyday", "comfortable"]
  },
  {
    id: 3,
    name: "Floral Summer Dress",
    price: 89.99,
    image: "https://via.placeholder.com/300x400?text=Summer+Dress&bg=FFB6C1&color=000000",
    description: "Light and breezy perfect for summer parties",
    category: "casual",
    tags: ["summer", "party", "floral"]
  },
  {
    id: 4,
    name: "White Business Shirt",
    price: 59.99,
    image: "https://via.placeholder.com/300x400?text=Business+Shirt&bg=ffffff&color=000000",
    description: "Crisp professional look for office wear",
    category: "formal",
    tags: ["business", "professional", "office"]
  },
  {
    id: 5,
    name: "Red Evening Gown",
    price: 199.99,
    image: "https://via.placeholder.com/300x400?text=Evening+Gown&bg=DC143C&color=ffffff",
    description: "Stunning gown for weddings and special occasions",
    category: "formal",
    tags: ["wedding", "party", "elegant", "evening"]
  },
  {
    id: 6,
    name: "Casual Sneakers",
    price: 89.99,
    image: "https://via.placeholder.com/300x400?text=Sneakers&bg=808080&color=ffffff",
    description: "Comfortable shoes for everyday activities",
    category: "casual",
    tags: ["casual", "comfortable", "everyday"]
  }
];

// Routes
router.post('/image-match', upload.single('image'), (req, res) => {
  try {
    console.log('Image uploaded:', req.file?.filename);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Return a mix of items as if AI found similar styles
      const recommendations = fashionCollection.slice(0, 4);
      
      res.json({
        success: true,
        message: 'Image processed successfully! Found matching items.',
        recommendations: recommendations
      });
    }, 1500);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process image' 
    });
  }
});

router.get('/wishlist-match/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    console.log('Getting pairing suggestions for item:', itemId);
    
    // Find the base item
    const baseItem = fashionCollection.find(item => item.id == itemId);
    
    if (!baseItem) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    // Get complementary items (different category or complementary styles)
    const recommendations = fashionCollection.filter(item => 
      item.id != itemId && 
      (item.category !== baseItem.category || Math.random() > 0.5)
    ).slice(0, 3);
    
    res.json({
      success: true,
      message: `Found ${recommendations.length} items that pair well with ${baseItem.name}`,
      baseItem: baseItem,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error getting wishlist recommendations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get wishlist recommendations' 
    });
  }
});

router.get('/occasion/:occasion', (req, res) => {
  try {
    const { occasion } = req.params;
    console.log('Getting outfit recommendations for occasion:', occasion);
    
    let recommendations = [];
    
    // Filter based on occasion
    if (occasion.toLowerCase().includes('wedding') || occasion.toLowerCase().includes('formal')) {
      recommendations = fashionCollection.filter(item => 
        item.category === 'formal' || item.tags.includes('wedding') || item.tags.includes('elegant')
      );
    } else if (occasion.toLowerCase().includes('casual') || occasion.toLowerCase().includes('everyday')) {
      recommendations = fashionCollection.filter(item => 
        item.category === 'casual' || item.tags.includes('casual')
      );
    } else if (occasion.toLowerCase().includes('business') || occasion.toLowerCase().includes('office')) {
      recommendations = fashionCollection.filter(item => 
        item.tags.includes('business') || item.tags.includes('professional')
      );
    } else if (occasion.toLowerCase().includes('party')) {
      recommendations = fashionCollection.filter(item => 
        item.tags.includes('party') || item.tags.includes('evening')
      );
    } else {
      // Default: return a curated mix
      recommendations = fashionCollection.slice(0, 4);
    }
    
    res.json({
      success: true,
      message: `Curated ${recommendations.length} perfect looks for ${occasion}`,
      occasion: occasion,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error getting occasion recommendations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get occasion recommendations' 
    });
  }
});

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fashion Stylist API is running',
    timestamp: new Date().toISOString(),
    totalItems: fashionCollection.length
  });
});

export default router;