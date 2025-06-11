import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ShoeDetails.css';

export default function ShoeDetails() {
  const { slug } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/shoes/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        setShoe(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement détails paire :', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="shoe-details">Chargement...</div>;
  if (!shoe) return <div className="shoe-details">Paire introuvable.</div>;

  return (
    <div className="shoe-details">
      <Link to="/admin" className="back-button">← Retour</Link>
      <div className="details-container">
        <div className="left">
          <img src={shoe.image} alt={shoe.name} className="details-image" />
        </div>
        <div className="right">
          <h2>{shoe.name}</h2>
          <h4>Tailles disponibles :</h4>
          <ul>
            {shoe.sizes.sort((a, b) => a - b).map(size => (
              <li key={size}>Taille {size}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
