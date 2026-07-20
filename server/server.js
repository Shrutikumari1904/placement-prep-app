// server.js — this is the file that STARTS everything.

require('dotenv').config(); // loads variables from .env (like our secret keys)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Connect to MongoDB ----
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ---- Routes ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/dsatopics', require('./routes/dsaRoutes'));

app.get('/', (req, res) => {
  res.send('Placement Prep API is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));