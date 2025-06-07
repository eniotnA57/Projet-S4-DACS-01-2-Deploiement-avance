import React, { useEffect, useState } from 'react';

function App() {
  const [shoes, setShoes] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Charger la liste des paires
  useEffect(() => {
    fetch('http://localhost:8000/api/shoes')
      .then(res => res.json())
      .then(data => setShoes(data));
  }, []);

  // Ajouter une paire
  const handleAdd = async () => {
    await fetch('http://localhost:8000/api/shoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price }),
    });
    setName('');
    setPrice('');
    // Recharge la liste
    fetch('http://localhost:8000/api/shoes')
      .then(res => res.json())
      .then(data => setShoes(data));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Gestion Stock Sneakers</h1>
      <input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Prix" value={price} onChange={e => setPrice(e.target.value)} type="number" />
      <button onClick={handleAdd}>Ajouter</button>
      <ul>
        {shoes.map((s, i) => (
          <li key={i}>{s.name} – {s.price} €</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
