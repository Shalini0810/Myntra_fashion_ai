import React, { useState } from 'react';
import { getImageBasedRecommendation } from '../services/recommendationAPI';

export default function ImageMatcher() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => setImage(e.target.files[0]);

  const handleSubmit = async () => {
    if (!image) {
      alert('Please select an image first!');
      return;
    }
    
    setLoading(true);
    try {
      const res = await getImageBasedRecommendation(image);
      setResults(res.recommendations || []); // Fixed: was res.items
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="image" className="container mt-5">
      <h3>🔍 Image-Based Matching</h3>
      <p>Upload an image to find matching items from our collection</p>
      
      <div className="mb-3">
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageUpload} 
          className="form-control" 
        />
      </div>
      
      <button 
        onClick={handleSubmit} 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Finding Matches...' : 'Find Matches'}
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
          !loading && <p className="mt-3">Upload an image to see matching recommendations!</p>
        )}
      </div>
    </div>
  );
}