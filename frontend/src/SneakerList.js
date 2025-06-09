import React, { useState } from 'react';
import './SneakerList.css';

export default function SneakerList({ sneakers = [], onDelete, search = '' }) {
  const [selectedShoe, setSelectedShoe] = useState(null); // 👈 Pour la vue détail

  const searchTerms = search.toLowerCase().trim().split(/\s+/);

  const filteredSneakers = sneakers.filter(shoe => {
    const values = [
      shoe.name,
      shoe.code,
      shoe.category,
      String(shoe.size),
      shoe.user?.username || ''
    ].map(v => String(v || '').toLowerCase());

    return searchTerms.every(term =>
      values.some(val => val.includes(term))
    );
  });

  const grouped = {};
  filteredSneakers.forEach(shoe => {
    const key = shoe.slug;
    if (!grouped[key]) {
      grouped[key] = {
        ...shoe,
        sizes: [shoe.size],
        ids: [shoe._id]
      };
    } else {
      grouped[key].sizes.push(shoe.size);
      grouped[key].ids.push(shoe._id);
    }
  });

  const groupedSneakers = Object.values(grouped);

  // 🔍 Affichage de la vue détail (si sélectionné)
  if (selectedShoe) {
    return (
      <div className="sneaker-detail-view">
        <button onClick={() => setSelectedShoe(null)} className="back-button">← Retour</button>
        <div className="sneaker-detail-container">
          <img
            src={selectedShoe.image}
            alt={selectedShoe.name}
            className="sneaker-detail-image"
          />
          <div className="sneaker-detail-info">
            <h2>{selectedShoe.name}</h2>
            <h3>Tailles disponibles :</h3>
            <ul>
              {selectedShoe.sizes.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
            <button
              className="sneaker-delete-btn"
              onClick={() => {
                if (window.confirm("Supprimer toutes les tailles ?")) {
                  selectedShoe.ids.forEach(id => onDelete(id));
                  setSelectedShoe(null);
                }
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🧱 Affichage classique en grille
  return (
    <div className="sneaker-grid sneaker-left">
      {groupedSneakers.length === 0 && search.trim() !== '' ? (
        <div className="sneaker-card empty">Aucune paire ne correspond à la recherche.</div>
      ) : (
        groupedSneakers.map(shoe => (
          <div
            key={shoe.slug}
            className="sneaker-card"
            onClick={() => setSelectedShoe(shoe)}
            style={{ cursor: 'pointer' }}
          >
            {shoe.image && (
              <img src={shoe.image} alt={shoe.name} className="sneaker-img" />
            )}
            <div className="sneaker-name">{shoe.name}</div>
            <div className="sneaker-sizes">
              <em>(clique pour voir les tailles)</em>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
