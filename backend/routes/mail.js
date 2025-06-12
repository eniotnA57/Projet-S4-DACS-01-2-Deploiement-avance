const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Route POST /api/mail/payment
router.post('/payment', async (req, res) => {
  const { email, total, shoes } = req.body;

  if (!email || !total || !shoes) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  try {
    const shoesList = shoes.map(s => `${s.name} ${s.size} - ${s.price}€`).join('<br>');

    await transporter.sendMail({
      from: `"Stock Manager" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Confirmation de virement effectué",
      html: `<h3>Bonjour,</h3>
             <p>Nous vous confirmons le virement de <strong>${total}€</strong> pour les paires suivantes :</p>
             <p>${shoesList}</p>
             <p>Merci pour votre confiance.</p>`
    });

    console.log(`✅ Email de paiement envoyé à ${email}`);

    res.json({ message: 'Email envoyé' });
  } catch (err) {
    console.error('Erreur envoi email paiement:', err);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

module.exports = router;
