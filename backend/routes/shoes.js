const express = require('express');
const router = express.Router();

// Exemple de route GET
router.get('/', (req, res) => {
  res.json({ message: 'Liste des sneakers 🏀' });
});

module.exports = router;
