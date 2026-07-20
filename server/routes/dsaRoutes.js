// routes/dsaRoutes.js
// Handles: GET /api/dsatopics  and  GET /api/dsatopics/:name

const express = require('express');
const router = express.Router();
const DsaTopic = require('../models/DsaTopic');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET all topics (used for a future "browse all topics" page, optional)
router.get('/', async (req, res) => {
  try {
    const topics = await DsaTopic.find().sort({ name: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET one topic by NAME (case-insensitive) — this is what CompanyDetail's tags will call
// Example: /api/dsatopics/Arrays
router.get('/:name', async (req, res) => {
  try {
    const topic = await DsaTopic.findOne({
      name: { $regex: `^${escapeRegex(req.params.name)}$`, $options: 'i' },
    });
    if (!topic) {
      return res.status(404).json({ message: 'No info found for this topic yet' });
    }
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
router.get("/", async (req, res) => {
    console.log("✅ GET /api/dsatopics called");

    try {
        const topics = await DsaTopic.find().sort({ name: 1 });
        res.json(topics);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});