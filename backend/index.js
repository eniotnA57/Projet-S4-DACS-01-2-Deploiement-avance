const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let shoes = [];

app.get('/api/shoes', (req, res) => res.json(shoes));

app.post('/api/shoes', (req, res) => {
  const { name, price } = req.body;
  shoes.push({ name, price });
  res.status(201).json({ message: 'Ajouté !' });
});

// NOTE LA MODIF ICI ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
app.listen(8000, '0.0.0.0', () => console.log('API running on port 8000'));
