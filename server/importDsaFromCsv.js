// importDsaFromCsv.js
// Imports REAL question data from the open-source LeetCode company-wise dataset:
// https://github.com/liquidslr/leetcode-company-wise-problems
//
// HOW TO USE:
// 1. Go to the GitHub repo above, open a company folder (e.g. "Amazon")
// 2. Open a csv file (contains questions for that company)
// 3. Click the "Download raw file" button to save the .csv
// 4. Put the downloaded file into server/data/  — name doesn't matter, just keep .csv extension
// 5. Run: node importDsaFromCsv.js

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const mongoose = require('mongoose');
const DsaTopic = require('./models/DsaTopic');

const DATA_DIR = path.join(__dirname, 'data');
const MAX_SAMPLES_PER_TOPIC = 8;

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function importFromCsvFiles() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for CSV import...');

  if (!fs.existsSync(DATA_DIR)) {
    console.log('❌ No "data" folder found. Create server/data/ and put CSV files in it.');
    process.exit(1);
  }

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.toLowerCase().endsWith('.csv'));
  if (files.length === 0) {
    console.log('❌ No .csv files found inside server/data/. Download one from GitHub first.');
    process.exit(1);
  }

  let totalRows = 0;
  let totalTopicsTouched = new Set();

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');

    let records;
    try {
      records = parse(raw, { columns: true, skip_empty_lines: true, trim: true });
    } catch (err) {
      console.log(`⚠️  Skipped ${file} — couldn't parse as CSV (${err.message})`);
      continue;
    }

    console.log(`Reading ${file} (${records.length} rows)...`);

    for (const row of records) {
      const title = row.Title || row.title || row.Question || '';
      const topicsRaw = row.Topics || row.topics || row.Tags || '';
      const difficulty = row.Difficulty || row.difficulty || '';

      if (!title || !topicsRaw) continue;

      const topics = topicsRaw.split(',').map((t) => t.trim()).filter(Boolean);
      const label = difficulty ? `${title} (${difficulty})` : title;

      for (const topicName of topics) {
        totalTopicsTouched.add(topicName);

        let topicDoc = await DsaTopic.findOne({
          name: { $regex: `^${escapeRegex(topicName)}$`, $options: 'i' },
        });

        if (!topicDoc) {
          topicDoc = await DsaTopic.create({
            name: topicName,
            description: 'Real questions imported from an open-source interview dataset.',
            commonQuestionTypes: [],
            sampleQuestions: [],
          });
        }

        if (!topicDoc.sampleQuestions.includes(label) && topicDoc.sampleQuestions.length < MAX_SAMPLES_PER_TOPIC) {
          topicDoc.sampleQuestions.push(label);
          await topicDoc.save();
        }
      }
      totalRows++;
    }
  }

  console.log(`✅ Processed ${totalRows} questions across ${totalTopicsTouched.size} topics.`);
  process.exit(0);
}

importFromCsvFiles().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});