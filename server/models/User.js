// models/User.js
// A "model" is a blueprint for what data looks like.
// Every user document saved in MongoDB will follow this shape.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,   // no two users can sign up with the same email
    lowercase: true,
  },
  password: {
    type: String,
    required: true, // this will store the HASHED password, never plain text
  },
}, { timestamps: true }); // adds createdAt / updatedAt automatically

module.exports = mongoose.model('User', userSchema);
