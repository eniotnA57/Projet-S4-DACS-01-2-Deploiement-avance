import React, { useEffect, useState } from 'react';
import './UserDashboard.css';

export default function UserDashboard({ username }) {
  const [sneakers, setSneakers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = decoded.id;

    fetch(`http://localhost:8000/api/shoes?user=${userId}`)
      .then(res => res.json())
      .then(data => setSneakers(data))
      .catch(err => console.error('Erreur chargement sneakers:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const filtered = sneakers.filter(shoe => {
    const q = search.toLowerCase();
    return (
      shoe.name.toLowerCase().includes(q) ||
      shoe.code.toLowerCase().includes(q) ||
      String(shoe.size).includes(q) ||
      shoe.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="user-dashboard">
      <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>

      <h2 className="welcome-title">Bienvenue, {username}</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher dans vos paires..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="sneaker-grid">
        {filtered.map(shoe => (
          <div key={shoe._id} className="sneaker-tile">
            <img src={shoe.image} alt={shoe.name} className="sneaker-image" />
            <div className="sneaker-name">{shoe.name}</div>
            <div className="sneaker-info">
              <p><strong>Prix :</strong> {shoe.price} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
