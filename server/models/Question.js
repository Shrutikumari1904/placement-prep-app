// models/Question.js
// Stores an individual interview question, linked to the company that asks it.

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD', ''],
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  topics: {
    type: [String], // e.g. ["Array", "Hash Table"]
    default: [],
  },
  frequency: {
    type: Number, // how often this company asks it, from the CSV
    default: 0,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
}, { timestamps: true });

// Speeds up "give me all questions for company X" queries
questionSchema.index({ company: 1 });
// Prevents the exact same question being duplicated for the same company
questionSchema.index({ company: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);