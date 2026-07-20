// cleanupCompanies.js
// Keeps only our chosen 13 companies (deleting everything else the import created),
// and sets accurate payTier + avgPackageLPA for each of them.

require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./models/Company');
const Question = require('./models/Question');

// The only companies we want to keep, with real fresher package data (LPA).
const KEEP = [
  { name: 'Google',      payTier: 'high',   avgPackageLPA: 36 },
  { name: 'Amazon',      payTier: 'high',   avgPackageLPA: 24 },
  { name: 'PhonePe',     payTier: 'high',   avgPackageLPA: 20 },
  { name: 'Flipkart',    payTier: 'medium', avgPackageLPA: 18 },
  { name: 'Swiggy',      payTier: 'medium', avgPackageLPA: 15 },
  { name: 'Zomato',      payTier: 'medium', avgPackageLPA: 14 },
  { name: 'Paytm',       payTier: 'medium', avgPackageLPA: 12 },
  { name: 'Freshworks',  payTier: 'medium', avgPackageLPA: 12 },
  { name: 'Accenture',   payTier: 'low',    avgPackageLPA: 5.5 },
  { name: 'Cognizant',   payTier: 'low',    avgPackageLPA: 4.25 },
  { name: 'Infosys',     payTier: 'low',    avgPackageLPA: 4 },
  { name: 'TCS',         payTier: 'low',    avgPackageLPA: 3.6 },
  { name: 'Wipro',       payTier: 'low',    avgPackageLPA: 3.5 },
];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for cleanup...');

  const keepNames = KEEP.map((c) => c.name);

  const companiesToDelete = await Company.find({
    name: { $nin: keepNames.map((n) => new RegExp(`^${n}$`, 'i')) },
  });

  console.log(`Found ${companiesToDelete.length} companies to delete.`);

  let deletedQuestions = 0;
  for (const company of companiesToDelete) {
    const result = await Question.deleteMany({ company: company._id });
    deletedQuestions += result.deletedCount;
  }
  const deleteResult = await Company.deleteMany({
    _id: { $in: companiesToDelete.map((c) => c._id) },
  });

  console.log(`Deleted ${deleteResult.deletedCount} companies and ${deletedQuestions} of their questions.`);

  // Update the 13 kept companies with correct payTier + avgPackageLPA
  let updated = 0;
  let notFound = [];
  for (const c of KEEP) {
    const result = await Company.findOneAndUpdate(
      { name: { $regex: `^${c.name}$`, $options: 'i' } },
      { $set: { payTier: c.payTier, avgPackageLPA: c.avgPackageLPA } },
      { new: true }
    );
    if (result) {
      updated++;
    } else {
      notFound.push(c.name);
    }
  }

  console.log(`Updated payTier/avgPackageLPA for ${updated} companies.`);
  if (notFound.length > 0) {
    console.log(`⚠️  These companies were NOT found in your database (check spelling/folder name): ${notFound.join(', ')}`);
  }

  const finalCompanies = await Company.find({}).select('name payTier avgPackageLPA');
  console.log('\n--- Final Company List ---');
  finalCompanies.forEach((c) => console.log(`${c.name} — ${c.payTier} — ₹${c.avgPackageLPA} LPA`));

  process.exit(0);
}

cleanup().catch((err) => {
  console.error('❌ Cleanup failed:', err);
  process.exit(1);
});