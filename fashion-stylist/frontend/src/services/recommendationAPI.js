import axios from 'axios';

const API_URL = "http://localhost:5000/api";

// Configure axios defaults
axios.defaults.timeout = 10000;

export async function getImageBasedRecommendation(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(`${API_URL}/image-match`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in image-based recommendation:', error);
    throw new Error('Failed to get image recommendations');
  }
}

export async function getWishlistRecommendation(itemId) {
  try {
    const response = await axios.get(`${API_URL}/wishlist-match/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error in wishlist recommendation:', error);
    throw new Error('Failed to get wishlist recommendations');
  }
}

export async function getOccasionRecommendation(occasion) {
  try {
    const response = await axios.get(`${API_URL}/occasion/${occasion}`);
    return response.data;
  } catch (error) {
    console.error('Error in occasion recommendation:', error);
    throw new Error('Failed to get occasion recommendations');
  }
}