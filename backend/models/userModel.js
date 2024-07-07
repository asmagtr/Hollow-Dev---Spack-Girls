const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:{ type: String, required: true, unique: true },
  fullName:{type:String, requires:true},
  username:{ type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String,default: 'user' },
  voted: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);