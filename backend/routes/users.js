const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT_SECRET = process.env.JWT_SECRET || 'secretpardefault';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erreur vérification token:', err);
    res.status(401).json({ error: 'Token invalide' });
  }
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, '_id username');
    res.json(users);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne(
      { _id: mongoose.Types.ObjectId(id) },
      'username email phone iban'
    );

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Erreur récupération utilisateur :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
});

router.get('/by-username/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne(
      { username },
      'username email phone iban'
    );

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Erreur récupération par username :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
});

router.patch('/by-username/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;
  const { phone, iban } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { phone, iban },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Profil mis à jour', user: updatedUser });
  } catch (err) {
    console.error('Erreur mise à jour profil par username:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { phone, iban } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { phone, iban },
      { new: true }
    );
    res.status(200).json({ message: 'Profil mis à jour', user: updatedUser });
  } catch (err) {
    console.error('Erreur mise à jour profil :', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;
