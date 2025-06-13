
console.log('✅ Fichier /routes/auth.js chargé !');

require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'secretpardefault';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, email, role = 'user' } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      role
    });

    // ✅ Envoi d'email de bienvenue
    await transporter.sendMail({
      from: `"Stock Manager" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Bienvenue ! 👟",
      html: `<h3>Bonjour ${firstName},</h3>
             <p>Merci pour votre inscription sur notre gestionnaire de stock de sneakers.</p>`
    });

    
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );


    res.status(201).json({ token });
  } catch (err) {
    console.error('Erreur register :', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Utilisateur inconnu' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    console.log('✅ user trouvé pour login:', user);

    // ✅ Création du token avec l'email inclus
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email // 🔥 AJOUT ICI
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('✅ Envoi du token :', token);
    res.json({ token });
  } catch (err) {
    console.error('Erreur login :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

module.exports = router;
