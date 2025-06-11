import React, { useState } from 'react';
import './PaiementPanel.css';

export default function PaiementPanel({ sneakers, setSneakers }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const pending = sneakers.filter(s => s.isSold && !s.isPaid);
  const pendingByUser = pending.reduce((acc, shoe) => {
    const username = shoe.user?.username || 'inconnu';
    if (!acc[username]) acc[username] = [];
    acc[username].push(shoe);
    return acc;
  }, {});

  return (
    <div className="a-payer-column">
      {!selectedUser ? (
        <>
          <h3>À payer</h3>
          {Object.entries(pendingByUser).map(([username, shoes]) => (
            <div key={username} className="user-box" onClick={() => setSelectedUser(username)}>
              {username} ({shoes.length})
            </div>
          ))}
        </>
      ) : (
        <>
          <button onClick={() => setSelectedUser(null)}>← Retour</button>
          <h3>Paiement : {selectedUser}</h3>
          <ul>
            {pendingByUser[selectedUser].map(s => (
              <li key={s._id}>
                {s.name} — {s.size} — {s.price}€
              </li>
            ))}
          </ul>
          <p>
            <strong>Total :</strong>{" "}
            {pendingByUser[selectedUser]
              .reduce((sum, s) => sum + parseFloat(s.price), 0)
              .toFixed(2)}€
          </p>
          <button
            onClick={async () => {
              for (let s of pendingByUser[selectedUser]) {
                await fetch(`http://localhost:8000/api/shoes/${s._id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ isPaid: true })
                });
              }
              setSneakers(prev =>
                prev.map(s =>
                  s.user?.username === selectedUser && s.isSold
                    ? { ...s, isPaid: true }
                    : s
                )
              );
              setSelectedUser(null);
            }}
          >
            Valider tous les paiements
          </button>
        </>
      )}
    </div>
  );
}
