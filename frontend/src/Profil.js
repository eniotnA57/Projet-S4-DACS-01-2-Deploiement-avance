import React, { useState, useEffect } from 'react';
import './Profil.css';

const API_URL = process.env.REACT_APP_API_URL;


export default function Profil({ username, onClose }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [iban, setIban] = useState('');
  const [message, setMessage] = useState('');

 
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/by-username/${username}`)
        const data = await res.json();
        console.log('✅ Infos user récupérées:', data);

        if (res.ok) {
          // Pas besoin de setUsername ici → tu l'as en props
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setIban(data.iban || '');
        } else {
          setMessage("❌ Erreur lors de la récupération du profil.");
        }
      } catch (err) {
        console.error('❌ Erreur réseau lors de la récupération du profil:', err);
        setMessage("❌ Erreur réseau.");
      }
    };

    fetchUserInfo();
  }, [username]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("❌ Vous n'êtes pas connecté.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/by-username/${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone, iban })
      });

      if (res.ok) {
        setMessage("✅ Profil mis à jour !");
        console.log("✅ Données enregistrées :", { phone, iban });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage("❌ Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
      setMessage("❌ Erreur réseau.");
    }
  };

  return (
    <div className="profile-page">
      <h2>Mon Profil</h2>

      <p><strong>Nom d'utilisateur :</strong> {username}</p>
      <p><strong>Email :</strong> {email?.trim() ? email : 'Non renseigné'}</p>

      <div className="profile-form">
        <label>Téléphone :</label>
        <input
          type="tel"
          value={phone}
          maxLength={10}
          onChange={e => setPhone(e.target.value)}
          placeholder="Ex : 0612345678"
        />

        <label>IBAN :</label>
        <input
          type="text"
          value={iban}
          maxLength={27}
          onChange={e => setIban(e.target.value.toUpperCase())}
          placeholder="Ex : FR7630006000011234567890189"
        />

        <button className="save-btn" onClick={handleSave}>Enregistrer</button>
        {message && <p className="profile-message">{message}</p>}
      </div>

      <button className="retour-btn" onClick={onClose}>Retour</button>
    </div>
  );
}
