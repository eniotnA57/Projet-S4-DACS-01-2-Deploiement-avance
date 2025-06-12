const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connexion à MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/stockdb')
  .then(() => console.log('MongoDB connecté !'))
  .catch(err => console.error('Erreur MongoDB :', err));

// 2. Routes d'auth
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// 3. Routes des sneakers (GET /api/shoes, etc.)
const shoesRoutes = require('./routes/shoes');
app.use('/api/shoes', shoesRoutes); // <-- active le fichier shoes.js

// 4. Routes des utilisateurs (GET /api/users, etc.)
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const mailRoutes = require('./routes/mail');
app.use('/api/mail', mailRoutes);

// 5. Lancement du serveur
app.listen(8000, '0.0.0.0', () => console.log('API running on port 8000'));


