import React, { useEffect, useState } from 'react';
import './MySneaker.css'; 
const API_URL = process.env.REACT_APP_API_URL;


export default function MySneakers({ userId, search }) {
  const [sneakers, setSneakers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !userId) return;

    const { role } = JSON.parse(atob(token.split('.')[1]));

    const query = role === 'admin' ? 'role=admin' : `user=${userId}&role=user`;

    fetch(`${process.env.REACT_APP_API_URL}/shoes?${query}`)
      .then(res => res.json())
      .then(data => setSneakers(data))
      .catch(err => console.error('Erreur chargement sneakers perso:', err));
  }, [userId]);

  const filteredSneakers = sneakers.filter(shoe => {
    const terms = search.toLowerCase().split(/\s+/);
    const valuesToSearch = [
      shoe.name,
      shoe.code,
      shoe.category,
      String(shoe.size),
      shoe.user?.username || ''
    ].map(val => String(val || '').toLowerCase());

    return terms.every(term =>
      valuesToSearch.some(field => field.includes(term))
    );
  });

  if (filteredSneakers.length === 0) {
    return <p style={{ textAlign: 'center' }}>Aucune paire trouvée.</p>;
  }

  return (
    <div className="my-sneakers-container">
      {filteredSneakers.map(shoe => (
        <div key={shoe._id} className="sneaker-card">
          <strong>{shoe.name}</strong>
          <p style={{ margin: 0 }}>Taille : {shoe.size}</p>
        </div>
      ))}
    </div>
  );
}
