import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import PaiementAttente from './PaiementAttente';
import Profil from './Profil';


export default function UserDashboard({ username, email }) {
  const [sneakers, setSneakers] = useState([]);
  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [userId, setUserId] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.id);
        console.log("✅ Token décodé :", decoded);
      } catch (e) {
        console.error("❌ Erreur lors du décodage du token :", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`${process.env.REACT_APP_API_URL}/shoes?user=${userId}`)
      .then(res => res.json())
      .then(data => {
        setSneakers(data);
        console.log("👟 Sneakers chargées :", data);
      })
      .catch(err => console.error('❌ Erreur chargement sneakers:', err));
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const availableSneakers = sneakers.filter(shoe => !shoe.isSold);

  const filtered = availableSneakers.filter(shoe => {
    const q = search.toLowerCase();
    return (
      shoe.name.toLowerCase().includes(q) ||
      shoe.code.toLowerCase().includes(q) ||
      String(shoe.size).includes(q) ||
      shoe.category.toLowerCase().includes(q)
    );
  });

  const enAttentePaiement = sneakers.filter(
    shoe => shoe.isSold && !shoe.isPaid
  );

  console.log("👤 UserDashboard → email reçu en props :", email);

  return (
    <div className="user-dashboard">
      {!showProfile && (
        <>
          <button className="profile-btn" onClick={() => setShowProfile(true)}>Profil</button>
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

          <div className="user-dashboard-content">
            <div className="sneakers-container">
              {filtered.map(shoe => (
                <div key={shoe._id} className="sneaker-card">
                  <img src={shoe.image} alt={shoe.name} className="sneaker-image" />
                  <div className="sneaker-name">{shoe.name}</div>
                  <div className="sneaker-info">
                    <p> {shoe.price} €</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="paiement-right">
              <PaiementAttente sneakers={enAttentePaiement} />
            </div>
          </div>
        </>
      )}

      {showProfile && (
        <Profil
          username={username} // au lieu de userId
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
