const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe');
const fetchWethenewImageFromApi = require('../utils/fetchWethenewImage');

// Normalisation du nom
const normalizeName = (name) =>
  name
    .toLowerCase()
    .replace(/['’‘`]/g, '') // supprime les apostrophes
    .replace(/\s+/g, ' ')    // normalise les espaces
    .trim();

// Génération de slug
const generateSlug = (name) => normalizeName(name).replace(/\s+/g, '-');

// GET - Toutes les paires (filtrable par utilisateur)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.user ? { user: req.query.user } : {};
    const shoes = await Shoe.find(filter).populate('user', 'username email iban');
    res.json(shoes);
  } catch (err) {
    console.error('Erreur GET /api/shoes :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST - Ajouter une paire
router.post('/', async (req, res) => {
  try {
    const { name, code, size, category, user, price } = req.body;
    const sizeNumber = Number(size);
    const parsedPrice = parseFloat(price);

    if (isNaN(sizeNumber)) return res.status(400).json({ error: 'Taille invalide' });
    if (isNaN(parsedPrice)) return res.status(400).json({ error: 'Prix invalide' });

    const normalizedName = normalizeName(name);
    const slug = generateSlug(name);

    const image = await fetchWethenewImageFromApi(slug);

    const newShoe = new Shoe({
      name: normalizedName,
      slug,
      code,
      size: sizeNumber,
      category,
      user,
      price: parsedPrice,
      image
    });

    const saved = await newShoe.save();
    const populated = await saved.populate('user', 'username email iban'); // ajouter email et iban aussi ici

    res.status(201).json(populated);
  } catch (err) {
    console.error('Erreur POST /api/shoes :', err.message);
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ error: 'Cette paire existe déjà.' });
    }
    res.status(500).json({ error: 'Erreur serveur lors de l\'ajout' });
  }
});

// DELETE - Supprimer une paire par ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Shoe.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Paire non trouvée' });
    res.json({ message: 'Paire supprimée' });
  } catch (err) {
    console.error('Erreur DELETE /api/shoes/:id :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Toutes les tailles d’un même modèle (par slug)
router.get('/slug/:slug', async (req, res) => {
  try {
    const shoes = await Shoe.find({ slug: req.params.slug }).populate('user', 'username');
    if (!shoes.length) return res.status(404).json({ error: 'Paire non trouvée' });

    const { name, image, slug } = shoes[0];
    const sizes = shoes.map(s => s.size);
    const ids = shoes.map(s => s._id);

    res.json({ name, image, slug, sizes, ids });
  } catch (err) {
    console.error('Erreur GET /api/shoes/slug/:slug :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE - Supprimer toutes les tailles d’une paire (par slug)
router.delete('/slug/:slug', async (req, res) => {
  try {
    const result = await Shoe.deleteMany({ slug: req.params.slug });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Aucune paire trouvée avec ce slug' });
    }
    res.json({ message: `${result.deletedCount} paires supprimées` });
  } catch (err) {
    console.error('Erreur DELETE /api/shoes/slug/:slug :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH - Met à jour une paire (vendue, payée, etc.)
router.patch('/:id', async (req, res) => {
  try {
    const update = { ...req.body };

    console.log('🔧 PATCH reçu pour la paire', req.params.id, 'avec :', update);

    // Forcer le bon format du champ user
    if (update.user && typeof update.user === 'object' && update.user._id) {
      update.user = update.user._id;
    }

    // Vérifie que l'ID user existe
    if (update.user) {
      const exists = await Shoe.db.model('User').exists({ _id: update.user });
      if (!exists) {
        return res.status(400).json({ error: 'Utilisateur introuvable' });
      }
    }

    // Mise à jour + populate complet
    const updated = await Shoe.findByIdAndUpdate(req.params.id, update, {
      new: true
    }).populate('user', 'username email iban'); // <- ici aussi on ajoute email + iban !

    if (!updated) {
      return res.status(404).json({ error: 'Paire non trouvée' });
    }

    console.log('✅ Pair updated → user:', updated.user);

    res.json(updated);
  } catch (err) {
    console.error('❌ Erreur PATCH /api/shoes/:id :', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;
