const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  code: { type: String, required: true },
  size: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, enum: ['adulte', 'enfant'], required: true },
  price: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isSold: { type: Boolean, default: false },  // ✅ Marque la paire comme vendue
  isPaid: { type: Boolean, default: false }   // ✅ Marque la paire comme payée au déposant
}, { timestamps: true });

// 🔧 Normalise le nom : supprime espaces multiples et met en minuscule
function normalizeName(name) {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

// 🔧 Génère un slug à partir du nom
function generateSlug(name) {
  return normalizeName(name).replace(/\s+/g, '-');
}

// 🧠 Pré-validation : mettre à jour name et slug si le nom a changé
shoeSchema.pre('validate', function (next) {
  if (this.isModified('name')) {
    this.name = normalizeName(this.name);
    this.slug = generateSlug(this.name);
  }
  next();
});

module.exports = mongoose.model('Shoe', shoeSchema);
