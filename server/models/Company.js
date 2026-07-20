// models/Company.js
// Blueprint for a company entry in our database.

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  payTier: {
    type: String,
    enum: ['high', 'medium', 'low'], // only these 3 values allowed
    required: true,
  },
  avgPackageLPA: {
    type: Number, // average package in "Lakhs Per Annum" — change unit if needed
    required: true,
  },
  dsaTopics: {
    type: [String], // e.g. ["Arrays", "Dynamic Programming", "Graphs"]
    default: [],
  },
  projectTypes: {
    type: [String], // e.g. ["Full Stack Web App", "Machine Learning", "System Design"]
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  logoUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Makes text search fast on these fields
companySchema.index({ name: 'text', dsaTopics: 'text', projectTypes: 'text' });

module.exports = mongoose.model('Company', companySchema);
