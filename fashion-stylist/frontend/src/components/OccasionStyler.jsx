import React, { useState } from 'react';
import { getOccasionRecommendation } from '../services/recommendationAPI';

export default function OccasionStyler() {
  const [occasion, setOccasion] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!occasion) {
      alert('Please enter an occasion!');
      return;
    }
    
    setLoading(true);
    try {
      const res = await getOccasionRecommendation(occasion);
      setResults(res.recommendations || []); // Fixed: was res.items
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const popularOccasions = ['wedding', 'party', 'formal', 'casual', 'business', 'date'];

  return (
    <div id="occasion" className="container mt-5">
      <h3>🎉 Occasion-Based Styling</h3>
      <p>Get curated looks for any occasion</p>
      
      <div className="mb-3">
        <input 
          type="text" 
          placeholder="Enter occasion (e.g., wedding, party, business)" 
          value={occasion} 
          onChange={(e) => setOccasion(e.target.value)} 
          className="form-control" 
        />
      </div>

      <div className="mb-3">
        <small className="text-muted">Popular occasions:</small>
        <div className="mt-2">
          {popularOccasions.map(occ => (
            <button 
              key={occ}
              className="btn btn-outline-secondary btn-sm me-2 mb-2"
              onClick={() => setOccasion(occ)}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>
      
      <button 
        onClick={handleSubmit} 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Curating Looks...' : 'Curate Complete Looks'}
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
          !loading && <p className="mt-3">Enter an occasion to see curated outfit suggestions!</p>
        )}
      </div>
    </div>
  );
}