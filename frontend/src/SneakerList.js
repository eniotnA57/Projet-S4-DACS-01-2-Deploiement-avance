import React from 'react';
import './SneakerList.css';

export default function SneakerList({
  sneakers = [],
  onDelete,
  search = '',
  selectedShoe,
  setSelectedShoe,
  onOpenModal
}) {
  const searchTerms = search.toLowerCase().trim().split(/\s+/);

  const filteredSneakers = sneakers
    .filter(shoe => !shoe.isSold) // 🔴 Seules les paires NON vendues
    .filter(shoe => {
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
            <h2>
              {selectedShoe.name} {selectedShoe.category === 'enfant' ? '(enfant)' : ''}
            </h2>
            <h3>Tailles disponibles :</h3>
            <div className="size-grid">
              {[...new Set(selectedShoe.sizes)]
                .sort((a, b) => parseFloat(a) - parseFloat(b))
                .map((size) => (
                  <div
                    key={`${selectedShoe.slug}-${size}`}
                    className="size-box"
                    onClick={() => onOpenModal(size, selectedShoe.slug)}
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
            <div className="sneaker-name">
              {shoe.name} {shoe.category === 'enfant' ? '(enfant)' : ''}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
