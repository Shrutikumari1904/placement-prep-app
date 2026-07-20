// seed.js — run this ONCE with `node seed.js` to fill your database with sample companies.
// Feel free to edit/add more companies here.

require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./models/Company');

const sampleCompanies = [
  {
    name: 'Google',
    payTier: 'high',
    avgPackageLPA: 44,
    dsaTopics: ['Arrays', 'Dynamic Programming', 'Graphs', 'Trees', 'System Design'],
    projectTypes: ['Distributed Systems', 'Machine Learning', 'Full Stack Web App'],
    description: 'Focuses heavily on DSA, system design, and CS fundamentals.',
  },
  {
    name: 'Amazon',
    payTier: 'high',
    avgPackageLPA: 32,
    dsaTopics: ['Arrays', 'Trees', 'Graphs', 'Leadership Principles (behavioral)'],
    projectTypes: ['Full Stack Web App', 'System Design', 'Cloud/AWS Projects'],
    description: 'Known for LP (Leadership Principle) interviews alongside DSA rounds.',
  },
  {
    name: 'Microsoft',
    payTier: 'high',
    avgPackageLPA: 30,
    dsaTopics: ['Linked Lists', 'Trees', 'Dynamic Programming', 'Bit Manipulation'],
    projectTypes: ['Full Stack Web App', 'Cloud/Azure Projects'],
    description: 'Balanced rounds of DSA + project discussion + CS fundamentals.',
  },
  {
    name: 'TCS Digital',
    payTier: 'medium',
    avgPackageLPA: 7,
    dsaTopics: ['Arrays', 'Strings', 'Basic Recursion', 'SQL'],
    projectTypes: ['Full Stack Web App', 'Academic Mini Projects'],
    description: 'Good starting point — moderate DSA, more focus on aptitude + communication.',
  },
  {
    name: 'Infosys',
    payTier: 'medium',
    avgPackageLPA: 6.5,
    dsaTopics: ['Arrays', 'Strings', 'OOP Concepts', 'DBMS'],
    projectTypes: ['Web Development', 'Academic Projects'],
    description: 'Focuses on aptitude, verbal, and basic coding rounds.',
  },
  {
    name: 'Wipro',
    payTier: 'low',
    avgPackageLPA: 3.5,
    dsaTopics: ['Basic Arrays', 'Loops', 'Simple Logic Building'],
    projectTypes: ['Any Academic Project'],
    description: 'Entry-level friendly, mostly aptitude + basic coding.',
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Company.deleteMany({}); // clear existing data first
    await Company.insertMany(sampleCompanies);

    console.log(`✅ Seeded ${sampleCompanies.length} companies successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedDB();
