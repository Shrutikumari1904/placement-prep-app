// importCompanyQuestions.js
// Imports REAL, company-specific interview questions from the open-source dataset:
// https://github.com/liquidslr/leetcode-company-wise-problems
//
// HOW TO USE:
// 1. Download the whole repo as ZIP, extract it
// 2. Put the extracted folder inside server/data/companies/
//    so you end up with: server/data/companies/Amazon/1. Thirty Days.csv, etc.
// 3. Run: node importCompanyQuestions.js

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const mongoose = require('mongoose');
const Company = require('./models/Company');
const Question = require('./models/Question');

const COMPANIES_DIR = path.join(__dirname, 'data', 'companies');

// Turns a folder name like "Airbnb" into a nice display name.
function cleanCompanyName(folderName) {
  return folderName.trim();
}

// Picks which CSV to use for a company if there are multiple time-range files.
// Prefers the "All" one (most complete), otherwise falls back to whatever exists.
function pickBestCsv(files) {
  const allFile = files.find((f) => f.toLowerCase().includes('all'));
  return allFile || files[0];
}

async function importCompanyQuestions() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for company question import...');

  if (!fs.existsSync(COMPANIES_DIR)) {
    console.log('❌ No "data/companies" folder found. See instructions at the top of this file.');
    process.exit(1);
  }

  const companyFolders = fs.readdirSync(COMPANIES_DIR).filter((entry) => {
    return fs.statSync(path.join(COMPANIES_DIR, entry)).isDirectory();
  });

  console.log(`Found ${companyFolders.length} company folders.`);

  let totalCompaniesCreated = 0;
  let totalCompaniesUpdated = 0;
  let totalQuestionsCreated = 0;
  let totalQuestionsSkipped = 0;

  for (const folder of companyFolders) {
    const companyName = cleanCompanyName(folder);
    const folderPath = path.join(COMPANIES_DIR, folder);

    const csvFiles = fs.readdirSync(folderPath).filter((f) => f.toLowerCase().endsWith('.csv'));
    if (csvFiles.length === 0) continue;

    const chosenFile = pickBestCsv(csvFiles);
    const filePath = path.join(folderPath, chosenFile);
    const raw = fs.readFileSync(filePath, 'utf-8');

    let records;
    try {
      // This dataset's CSVs have NO header row — columns are always in this order:
      // Difficulty, Title, Frequency, Acceptance Rate, Link, Topics
      records = parse(raw, {
        columns: ['difficulty', 'title', 'frequency', 'acceptanceRate', 'link', 'topics'],
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
    } catch (err) {
      console.log(`⚠️  Skipped ${folder} — couldn't parse CSV (${err.message})`);
      continue;
    }

    if (records.length === 0) continue;

    // Find or create the Company document
    let company = await Company.findOne({ name: { $regex: `^${companyName}$`, $options: 'i' } });

    // Collect topic names from this CSV to store on the Company doc too
    const topicSet = new Set();
    for (const row of records) {
      if (row.topics) {
        row.topics.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => topicSet.add(t));
      }
    }

    if (!company) {
      company = await Company.create({
        name: companyName,
        payTier: 'medium', // default — you can edit this later per company
        avgPackageLPA: 0, // default — fill in real data later
        dsaTopics: Array.from(topicSet),
        projectTypes: [],
        description: `Interview questions imported from an open-source dataset for ${companyName}.`,
      });
      totalCompaniesCreated++;
    } else {
      const mergedTopics = new Set([...(company.dsaTopics || []), ...topicSet]);
      company.dsaTopics = Array.from(mergedTopics);
      await company.save();
      totalCompaniesUpdated++;
    }

    // Now create Question documents for this company
    for (const row of records) {
      if (!row.title) continue;

      const difficulty = (row.difficulty || '').toUpperCase();
      const topics = row.topics ? row.topics.split(',').map((t) => t.trim()).filter(Boolean) : [];
      const frequency = parseFloat(row.frequency) || 0;

      try {
        await Question.create({
          title: row.title,
          difficulty: ['EASY', 'MEDIUM', 'HARD'].includes(difficulty) ? difficulty : '',
          link: row.link || '',
          topics,
          frequency,
          company: company._id,
        });
        totalQuestionsCreated++;
      } catch (err) {
        // Duplicate question for this company (same title) — skip silently
        if (err.code === 11000) {
          totalQuestionsSkipped++;
        } else {
          console.log(`⚠️  Error saving question "${row.title}" for ${companyName}: ${err.message}`);
        }
      }
    }

    console.log(`✅ ${companyName}: processed ${records.length} questions`);
  }

  console.log('\n--- Import Summary ---');
  console.log(`Companies created: ${totalCompaniesCreated}`);
  console.log(`Companies updated: ${totalCompaniesUpdated}`);
  console.log(`Questions created: ${totalQuestionsCreated}`);
  console.log(`Questions skipped (duplicates): ${totalQuestionsSkipped}`);
  process.exit(0);
}

importCompanyQuestions().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});