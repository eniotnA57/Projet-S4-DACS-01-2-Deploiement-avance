const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // pseudo
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  firstName: { type: String, required: true }, // prénom
  lastName: { type: String, required: true },  // nom
  email: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
