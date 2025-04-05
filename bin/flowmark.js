#!/usr/bin/env node

const { processFile } = require('../index');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let inputFile = 'example.md';
let outputFile = 'flowmark.html';
let watchMode = false;

// Process arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--input' || arg === '-i') {
    inputFile = args[++i];
  } else if (arg === '--output' || arg === '-o') {
    outputFile = args[++i];
  } else if (arg === '--watch' || arg === '-w') {
    watchMode = true;
  } else if (arg === '--help' || arg === '-h') {
    showHelp();
    process.exit(0);
  } else if (!inputFile || inputFile === 'example.md') {
    // If no explicit input file was set, use the first argument as input file
    inputFile = arg;
  }
}

// Show help
function showHelp() {
  console.log(`
FlowMark - Convert Markdown storyboards to HTML

Usage:
  flowmark [options] [input-file]

Options:
  --input, -i <file>    Input Markdown file (default: example.md)
  --output, -o <file>   Output HTML file (default: flowmark.html)
  --watch, -w           Watch input file for changes and rebuild
  --help, -h            Show this help message

Examples:
  flowmark story.md
  flowmark -i story.md -o story.html
  flowmark --watch --input story.md
  `);
}

// Validate input file
if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file '${inputFile}' not found.`);
  process.exit(1);
}

// Process the file
function processStoryboard() {
  try {
    // Get absolute paths
    const inputPath = path.resolve(inputFile);
    const outputPath = path.resolve(outputFile);
    
    // Process the file
    processFile(inputPath, outputPath);
    
    console.log(`FlowMark: Generated ${outputPath} from ${inputPath}`);
    return true;
  } catch (error) {
    console.error('Error processing storyboard:', error);
    return false;
  }
}

// Initial processing
processStoryboard();

// Watch mode
if (watchMode) {
  console.log(`FlowMark: Watching ${inputFile} for changes (Ctrl+C to stop)...`);
  
  fs.watchFile(inputFile, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      console.log(`\nFlowMark: ${inputFile} changed, regenerating...`);
      processStoryboard();
    }
  });
} 