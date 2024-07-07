const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Candidate', candidateSchema);