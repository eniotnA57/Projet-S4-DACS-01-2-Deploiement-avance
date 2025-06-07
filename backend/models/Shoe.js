const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },        
  code: { type: String, required: true, unique: true },
  size: { type: Number, required: true },        
  category: { type: String, enum: ['adulte', 'enfant'], required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Shoe', shoeSchema);
