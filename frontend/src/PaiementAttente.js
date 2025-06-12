import React from 'react';
import './PaiementAttente.css';

export default function PaiementAttente({ sneakers }) {
  const pending = sneakers.filter(s => s.isSold && !s.isPaid);

  if (pending.length === 0) return null;

  const total = pending.reduce((sum, s) => sum + parseFloat(s.price), 0).toFixed(2);

  return (
  <div className="pending-payment-outer">
    <div className="pending-payment-box">
      <h3>En attente de paiement</h3>
      {pending.map(s => (
        <div key={s._id} className="pending-entry">
          {s.name} {s.size} {s.price} €
        </div>
      ))}
      <div className="pending-total">Total : {total} €</div>
    </div>
  </div>
);

}
