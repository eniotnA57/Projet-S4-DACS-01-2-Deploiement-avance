import React, { useEffect, useState } from 'react';
import AddSneakerForm from './AddSneakerForm';
import SneakerGrid from './SneakerList';
import PaiementPanel from './PaiementPanel';
import SizeModal from './SizeModal';
import './AdminDashboard.css';

export default function AdminDashboard({ username }) {
  const [sneakers, setSneakers] = useState([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/shoes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const visibles = data.filter(s => !(s.isSold && s.isPaid));
          setSneakers(visibles);
        } else {
          console.error("Données inattendues :", data);
        }
      })
      .catch(err => console.error('Erreur chargement sneakers:', err));
  }, []);

  const handleAdd = (newShoe) => {
    setSneakers(prev => [...prev, newShoe]);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Supprimer définitivement cette paire ?");
    if (!confirm) return;

    const res = await fetch(`http://localhost:8000/api/shoes/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setSneakers(prev => prev.filter(s => s._id !== id));
    } else {
      console.error('Erreur lors de la suppression');
    }
  };

  const handleOpenModal = (size, slug) => {
    const matches = sneakers
      .filter(s => s.slug === slug && s.size === size && !s.isSold)
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    setModalData({ size, slug, entries: matches });
    setIsModalOpen(true);
  };

  const handleModalDelete = (deletedId) => {
    setSneakers(prev => prev.filter(s => s._id !== deletedId));
    setModalData(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e._id !== deletedId)
    }));
    setSelectedShoe(prev => {
      if (!prev) return null;
      const index = prev.ids.indexOf(deletedId);
      if (index === -1) return prev;
      const newSizes = [...prev.sizes];
      const newIds = [...prev.ids];
      newSizes.splice(index, 1);
      newIds.splice(index, 1);
      return newSizes.length === 0 ? null : { ...prev, sizes: newSizes, ids: newIds };
    });
  };

  return (
    <div className="admin-dashboard">
      <h2 className="welcome-text">Bienvenue, {username} (admin)</h2>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Déconnexion
      </button>

      {!showForm && !isModalOpen && !selectedShoe && (
        <PaiementPanel sneakers={sneakers} setSneakers={setSneakers} />
      )}

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
          placeholder="Rechercher par nom, taille, code..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
      </div>

      <SneakerGrid
        sneakers={sneakers}
        onDelete={handleDelete}
        search={filter}
        onOpenModal={handleOpenModal}
        selectedShoe={selectedShoe}
        setSelectedShoe={setSelectedShoe}
      />

      {isModalOpen && modalData && (
        <SizeModal
          size={modalData.size}
          entries={modalData.entries}
          onClose={() => setIsModalOpen(false)}
          onValidate={async (id, updatedShoe) => {
            setSneakers(prev =>
              prev.map(s => (s._id === id ? updatedShoe : s))
            );
            setModalData(prev => ({
              ...prev,
              entries: prev.entries.filter(e => e._id !== id)
            }));
            setSelectedShoe(prev => {
              if (!prev) return null;
              const index = prev.ids.indexOf(id);
              if (index === -1) return prev;
              const newSizes = [...prev.sizes];
              const newIds = [...prev.ids];
              newSizes.splice(index, 1);
              newIds.splice(index, 1);
              return newSizes.length === 0
                ? null
                : { ...prev, sizes: newSizes, ids: newIds };
            });
          }}
          onDelete={handleModalDelete}
        />
      )}
    </div>
  );
}
