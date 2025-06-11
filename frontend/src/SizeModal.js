import React from 'react';
import './SizeModal.css';

export default function SizeModal({ entries, size, onClose, onValidate, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✖</button>
        <h3>Détail pour la taille {size}</h3>
        <ul>
          {entries.map((entry) => {
            const date = entry.createdAt
              ? new Date(entry.createdAt).toLocaleDateString('fr-FR')
              : 'Date inconnue';

            return (
              <li key={entry._id} style={{ marginBottom: '10px' }}>
                {entry.user?.username || 'inconnu'} — {entry.price}€ — {date}

                <button
                  style={{ marginLeft: '10px' }}
                  onClick={async () => {
                    const userId = entry.user?._id || entry.user;

                    try {
                      const res = await fetch(`http://localhost:8000/api/shoes/${entry._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          isSold: true,
                          isPaid: false,
                          user: userId,
                        }),
                      });

                      if (res.ok) {
                        const updated = await res.json();
                        onValidate(entry._id, updated);
                        onClose();
                      } else {
                        console.error('❌ Erreur côté serveur :', await res.text());
                      }
                    } catch (err) {
                      console.error('❌ Erreur réseau :', err);
                    }
                  }}
                >
                  Paiement
                </button>

                <button
                  style={{
                    marginLeft: '10px',
                    color: 'white',
                    backgroundColor: 'darkred',
                    border: 'none',
                    padding: '3px 6px',
                    borderRadius: '4px',
                  }}
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      'Supprimer définitivement cette paire ?'
                    );
                    if (!confirmDelete) return;

                    try {
                      const res = await fetch(`http://localhost:8000/api/shoes/${entry._id}`, {
                        method: 'DELETE',
                      });

                      if (res.ok) {
                        onDelete(entry._id);
                      } else {
                        console.error('❌ Erreur suppression :', await res.text());
                      }
                    } catch (err) {
                      console.error('❌ Erreur réseau :', err);
                    }
                  }}
                >
                  Supprimer
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
