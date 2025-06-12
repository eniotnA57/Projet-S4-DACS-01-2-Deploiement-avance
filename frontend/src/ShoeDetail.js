import React from 'react';
import './ShoeDetail.css';

const API_URL = process.env.REACT_APP_API_URL;


export default function ShoeDetail({ shoe, onBack, onSizeClick }) {
  const sizes = [...new Set(shoe.variants?.map(v => v.size) || [])];

  return (
    <div className="shoe-detail-fullscreen">
      <button className="back-button" onClick={onBack}>← Retour</button>
      <div className="detail-content">
        <img src={shoe.image} alt={shoe.name} className="detail-image" />
        <div className="detail-info">
          <h2>{shoe.name} {shoe.category === 'enfant' ? '(enfant)' : ''}</h2>
          <p><strong>Tailles disponibles :</strong></p>
          <div className="size-grid">
            {sizes
              .sort((a, b) => parseFloat(a) - parseFloat(b))
              .map((size, i) => (
                <div
                  key={i}
                  className="size-tile"
                  onClick={() => onSizeClick(size)}
                >
                  {size}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
