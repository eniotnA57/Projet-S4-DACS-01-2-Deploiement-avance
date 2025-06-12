import React, { useEffect, useState } from 'react';

export default function AddSneakerForm({ onAdd }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [size, setSize] = useState('');
  const [category, setCategory] = useState('adulte');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [price, setPrice] = useState('');

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Pas de token, pas d\'appel /api/users');
    setUsers([]);
    return;
  }

  fetch('process.env.REACT_APP_API_URL/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.warn('Réponse inattendue /api/users:', data);
        setUsers([]);
      }
    })
    .catch(err => {
      console.error('Erreur chargement utilisateurs:', err);
      setUsers([]);
    });
}, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSneaker = {
      name,
      code,
      size: parseInt(size),
      category: category.toLowerCase(),
      user: userId,
      price: parseFloat(price),
      isSold: false,
      isPaid: false 
    };

    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSneaker)
    });

    if (res.ok) {
      const created = await res.json();
      onAdd(created);
      setName('');
      setCode('');
      setSize('');
      setCategory('adulte');
      setUserId('');
      setPrice('');
    } else {
      const err = await res.json();
      alert("Erreur lors de l'ajout : " + (err.error || ''));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-sneaker-form">
      <input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Code" value={code} onChange={e => setCode(e.target.value)} required />
      <input type="number" placeholder="Taille" value={size} onChange={e => setSize(e.target.value)} required />
      <input type="number" placeholder="Prix demandé (€)" value={price} onChange={e => setPrice(e.target.value)} required />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="adulte">Adulte</option>
        <option value="enfant">Enfant</option>
      </select>
      <select value={userId} onChange={e => setUserId(e.target.value)} required>
        <option value="">-- Sélectionner un utilisateur --</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.username}</option>
        ))}
      </select>
      <button type="submit">Ajouter</button>
    </form>
  );
}
