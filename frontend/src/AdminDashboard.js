import React, { useEffect, useState } from 'react';
import AddSneakerForm from './AddSneakerForm';
import './AdminDashboard.css';

export default function AdminDashboard({ username }) {
  const [sneakers, setSneakers] = useState([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/shoes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSneakers(data);
        } else {
          console.error("Données inattendues reçues :", data);
        }
      })
      .catch(err => console.error('Erreur chargement sneakers:', err));
  }, []);

  const handleAdd = (newShoe) => {
    setSneakers(prev => [...prev, newShoe]);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:8000/api/shoes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSneakers(prev => prev.filter(s => s._id !== id));
    }
  };

  const grouped = sneakers.reduce((acc, shoe) => {
    if (!acc[shoe.slug]) acc[shoe.slug] = [];
    acc[shoe.slug].push(shoe);
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      <h2 className="welcome-text">Bienvenue, {username} (admin)</h2>

      <button className="logout-btn" onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}>
        Déconnexion
      </button>

      <button className="add-button-left" onClick={() => setShowForm(prev => !prev)}>
        {showForm ? "Annuler l'ajout" : "Ajouter une paire"}
      </button>

      {showForm && (
        <div className="add-sneaker-form-wrapper">
          <AddSneakerForm onAdd={handleAdd} />
        </div>
      )}

      <div className="centered-search">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={filter}
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
          className="search-input"
        />
      </div>

      <div className="sneaker-grid">
        {Object.entries(grouped)
          .filter(([slug, shoes]) => shoes[0].name.toLowerCase().includes(filter))
          .map(([slug, shoes]) => (
            <div key={slug} className="sneaker-tile">
              <img src={shoes[0].image} alt={shoes[0].name} className="sneaker-image" />
              <div className="sneaker-name">{shoes[0].name}</div>
              <button
                className="delete-button"
                onClick={() => handleDelete(shoes[0]._id)}
              >
                Supprimer
              </button>
            </div>
        ))}
      </div>
    </div>
  );
}
