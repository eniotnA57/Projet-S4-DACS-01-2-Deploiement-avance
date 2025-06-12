import React, { useState } from 'react';
import './PaiementPanel.css';

export default function PaiementPanel({ sneakers, setSneakers }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const pending = sneakers.filter(s => s.isSold && !s.isPaid);
  const pendingByUser = pending.reduce((acc, shoe) => {
    const username = shoe.user?.username || 'inconnu';
    const email = shoe.user?.email || 'Non renseigné';
    const iban = shoe.user?.iban || '';

    if (!acc[username]) {
      acc[username] = { shoes: [], email, iban };
    }

    acc[username].shoes.push(shoe);

    return acc;
  }, {});

  const handleValidatePayment = async () => {
    const userData = pendingByUser[selectedUser];

    // Bloque si pas d'IBAN
    if (!userData.iban || userData.iban === 'Pas d\'IBAN' || userData.iban.trim() === '') {
      alert('⚠️ Impossible de valider : IBAN manquant pour cet utilisateur.');
      return;
    }

    // Marque les paires comme payées
    for (let s of userData.shoes) {
      await fetch(`${process.env.REACT_APP_API_URL}/shoes/${s._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: true })
      });
    }

    // Calcule le total
    const total = userData.shoes
      .reduce((sum, s) => sum + parseFloat(s.price), 0)
      .toFixed(2);

    // Envoie l'email de confirmation
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/mail/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          total,
          shoes: userData.shoes.map(s => ({
            name: s.name,
            size: s.size,
            price: s.price
          }))
        })
      });
      console.log('✅ Email de paiement envoyé');
    } catch (err) {
      console.error('❌ Erreur envoi email de paiement:', err);
    }

    // Mets à jour l'état local
    setSneakers(prev =>
      prev.map(s =>
        s.user?.username === selectedUser && s.isSold
          ? { ...s, isPaid: true }
          : s
      )
    );

    setSelectedUser(null);
  };

  return (
    <div className="a-payer-column paiement-panel">
      {!selectedUser ? (
        <>
          <h3>À payer</h3>
          {Object.entries(pendingByUser).map(([username, data]) => (
            <button
              key={username}
              className="user-button"
              onClick={() => setSelectedUser(username)}
            >
              {username} ({data.shoes.length})
            </button>
          ))}
        </>
      ) : (
        <>
          <button className="back-button" onClick={() => setSelectedUser(null)}>← Retour</button>
          <h3>Paiement : {selectedUser}</h3>
          <p><strong>Email :</strong> {pendingByUser[selectedUser].email}</p>
          <p style={{ wordBreak: 'break-word' }}>
            <strong>IBAN :</strong> {pendingByUser[selectedUser].iban || 'Pas d\'IBAN'}
          </p>

          <div className="paiement-entries">
            {pendingByUser[selectedUser].shoes.map(s => (
              <div key={s._id} className="paiement-entry">
                {s.name} {s.size} {s.price}€
              </div>
            ))}
          </div>

          <p className="paiement-total">
            <strong>Total :</strong>{" "}
            {pendingByUser[selectedUser].shoes
              .reduce((sum, s) => sum + parseFloat(s.price), 0)
              .toFixed(2)}€
          </p>

          <button
            className="confirm-button"
            onClick={handleValidatePayment}
          >
            Valider tous les paiements
          </button>
        </>
      )}
    </div>
  );
}
