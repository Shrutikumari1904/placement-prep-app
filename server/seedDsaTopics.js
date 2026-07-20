// seedDsaTopics.js — run with `node seedDsaTopics.js`
// Fills the database with common question patterns for each DSA topic.
// Add more topics here anytime — just follow the same format.

require('dotenv').config();
const mongoose = require('mongoose');
const DsaTopic = require('./models/DsaTopic');

const topics = [
  {
    name: 'Arrays',
    description: 'The single most tested topic — nearly every interview includes at least one array question.',
    commonQuestionTypes: [
      'Two Pointer technique (pair sums, reversing, in-place modification)',
      'Sliding Window (subarray/substring with a constraint)',
      'Prefix Sum (range sum queries, subarray sum equals K)',
      "Kadane's Algorithm (Maximum Subarray)",
      'HashMap/HashSet lookup pattern (Two Sum, duplicates, frequency counting)',
      'Sorting-based problems & searching in a rotated sorted array',
    ],
  },
  {
    name: 'Strings',
    description: 'Often solved using the same patterns as arrays.',
    commonQuestionTypes: [
      'Palindrome checks',
      'Anagram / frequency-count problems',
      'Substring search (sliding window)',
      'String reversal and in-place manipulation',
      'Longest common prefix / longest common substring',
    ],
  },
  {
    name: 'Trees',
    description: 'Appears in roughly 1 in 3 technical interviews — tests recursive thinking and hierarchical data handling.',
    commonQuestionTypes: [
      'Tree traversals — Inorder / Preorder / Postorder (recursive & iterative)',
      'Level order traversal (BFS)',
      'Lowest Common Ancestor (LCA)',
      'Height / Diameter / Maximum Path Sum of a tree',
      'Binary Search Tree insert / search / delete / k-th smallest element',
      'Checking if a tree is a subtree of another tree',
    ],
  },
  {
    name: 'Graphs',
    description: 'Common at product-based companies; less frequent at service-based ones.',
    commonQuestionTypes: [
      'BFS / DFS traversal (connected components, shortest path in unweighted graphs)',
      "Dijkstra's algorithm (shortest path in weighted graphs)",
      'Cycle detection (directed & undirected)',
      'Topological sort (task scheduling / dependency resolution)',
      'Union-Find / Disjoint Set (Number of Provinces / friend circles style problems)',
    ],
  },
  {
    name: 'Dynamic Programming',
    description: 'Considered the hardest high-weightage topic — especially favored by Google-style interviews.',
    commonQuestionTypes: [
      'Knapsack variations (0/1 and unbounded)',
      'Longest Common Subsequence / Longest Increasing Subsequence',
      '1D DP basics (climbing stairs, coin change, house robber)',
      'Grid / matrix path problems (unique paths, minimum path sum)',
      'Fibonacci-style memoization vs tabulation problems',
    ],
  },
  {
    name: 'Linked Lists',
    description: 'A small, well-defined set of classic problems that repeat across almost every interview process.',
    commonQuestionTypes: [
      'Reverse a linked list (iterative & recursive)',
      "Detect a cycle & find its start (Floyd's / fast-slow pointer)",
      'Merge two (or K) sorted linked lists',
      'Find the middle element',
      'Remove Nth node from the end / palindrome linked list check',
    ],
  },
  {
    name: 'Basic Recursion',
    description: 'Foundation for backtracking and DP.',
    commonQuestionTypes: [
      'Factorial / Fibonacci using recursion',
      'Basic backtracking (subsets, permutations)',
      'Tower of Hanoi',
    ],
  },
  {
    name: 'Bit Manipulation',
    description: 'Less common but appears in optimization-focused rounds.',
    commonQuestionTypes: [
      'XOR-based problems (find unique element)',
      'Count set bits',
      'Check if a number is a power of two',
    ],
  },
  {
    name: 'OOP Concepts',
    description: 'Common in service-based company interviews.',
    commonQuestionTypes: [
      'Explain the 4 pillars with real examples',
      'Design questions (e.g. design a parking lot / library system)',
      'Difference between overloading and overriding',
    ],
  },
  {
    name: 'DBMS',
    description: 'Core CS fundamentals round.',
    commonQuestionTypes: [
      'Normalization (1NF, 2NF, 3NF)',
      'ACID properties',
      'Primary key vs foreign key, types of joins',
    ],
  },
  {
    name: 'SQL',
    description: 'Practical query-writing round.',
    commonQuestionTypes: [
      'Writing queries with JOIN and GROUP BY',
      'Subqueries and nested queries',
      'Window functions (RANK, ROW_NUMBER)',
    ],
  },
];

async function seedDsaTopics() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for DSA topic seeding...');

    await DsaTopic.deleteMany({});
    await DsaTopic.insertMany(topics);

    console.log(`✅ Seeded ${topics.length} DSA topics successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ DSA topic seeding failed:', err);
    process.exit(1);
  }
}

seedDsaTopics();
