import React, { useState } from 'react';
import { getWishlistRecommendation } from '../services/recommendationAPI';

export default function WishlistStyler() {
  const [itemId, setItemId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!itemId) {
      alert('Please enter an item ID!');
      return;
    }
    
    setLoading(true);
    try {
      const res = await getWishlistRecommendation(itemId);
      setResults(res.recommendations || []); // Fixed: was res.items
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="wishlist" className="container mt-5">
      <h3>💝 Wishlist Pairing</h3>
      <p>Enter a wishlist item ID to get matching pieces</p>
      
      <div className="mb-3">
        <input 
          type="number" 
          placeholder="Enter Item ID (1-4)" 
          value={itemId} 
          onChange={(e) => setItemId(e.target.value)} 
          className="form-control" 
        />
      </div>
      
      <button 
        onClick={handleSubmit} 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Getting Suggestions...' : 'Get Pairing Suggestions'}
      </button>

      <div className="row mt-4">
        {results.length > 0 ? (
          results.map(item => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <img src={item.image} className="card-img-top" alt={item.name} style={{height: '250px', objectFit: 'cover'}} />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text"><strong>${item.price}</strong></p>
                  <span className="badge bg-secondary">{item.category}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="mt-3">Enter an item ID to see pairing suggestions!</p>
        )}
      </div>
    </div>
  );
}