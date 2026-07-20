// models/DsaTopic.js
// Stores info about a DSA topic: what kinds of questions are commonly asked in it.

const mongoose = require('mongoose');

const dsaTopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  commonQuestionTypes: {
    type: [String], // e.g. ["Two Pointer problems", "Sliding Window", "Kadane's Algorithm"]
    default: [],
  },
  sampleQuestions: {
     type: [String], // Real question titles imported from open-source datasets (e.g. "Two Sum (Easy)")
     default: [],
   },
}, { timestamps: true });

module.exports = mongoose.model('DsaTopic', dsaTopicSchema);
