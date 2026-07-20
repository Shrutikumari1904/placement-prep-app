// routes/companyRoutes.js
// Handles everything about companies: searching, filtering, viewing details.

const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const protect = require('../middleware/authMiddleware');

// ---------------- GET /api/companies ----------------
// Supports: ?search=google  and  ?tier=high
// Example: /api/companies?search=amazon&tier=high
router.get('/', async (req, res) => {
  try {
    const { search, tier } = req.query;
    let filter = {};

    if (tier) {
      filter.payTier = tier; // 'high' | 'medium' | 'low'
    }

    if (search) {
      // case-insensitive search across name, dsaTopics, projectTypes
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { dsaTopics: { $regex: search, $options: 'i' } },
        { projectTypes: { $regex: search, $options: 'i' } },
      ];
    }

    const companies = await Company.find(filter).sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------------- GET /api/companies/:id ----------------
// Get full detail of one company
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------------- POST /api/companies ----------------
// Add a new company — PROTECTED (must be logged in, uses our `protect` middleware)
router.post('/', protect, async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
