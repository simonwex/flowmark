#!/usr/bin/env node

const { processFile } = require('../index');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let inputFile = 'example.md';
let outputFile = 'flowmark.html';
let watchMode = false;
let directoryMode = false;
let inputDir = null;
let outputDir = null;
let recursive = false;

// Process arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--input' || arg === '-i') {
    inputFile = args[++i];
  } else if (arg === '--output' || arg === '-o') {
    outputFile = args[++i];
  } else if (arg === '--watch' || arg === '-w') {
    watchMode = true;
  } else if (arg === '--dir' || arg === '-d') {
    directoryMode = true;
    inputDir = args[++i];
  } else if (arg === '--outdir' || arg === '--output-dir') {
    outputDir = args[++i];
  } else if (arg === '--recursive' || arg === '-r') {
    recursive = true;
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
  --input, -i <file>      Input Markdown file (default: example.md)
  --output, -o <file>     Output HTML file (default: flowmark.html)
  --dir, -d <directory>   Process all markdown files in directory
  --outdir <directory>    Output directory for HTML files (default: same as input)
  --recursive, -r         Process subdirectories recursively
  --watch, -w             Watch input file/directory for changes and rebuild
  --help, -h              Show this help message

Examples:
  flowmark story.md
  flowmark -i story.md -o story.html
  flowmark --watch --input story.md
  flowmark --dir ./storyboards --outdir ./html
  flowmark -d ./storyboards -r
  `);
}

// Find all markdown files in a directory
function findMarkdownFiles(dir, recursive = false, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && recursive) {
      findMarkdownFiles(filePath, recursive, fileList);
    } else if (stat.isFile() && 
               (file.endsWith('.md') || file.endsWith('.markdown'))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Process a single file
function processStoryboardFile(inputPath, outputPath) {
  try {
    // Process the file
    processFile(inputPath, outputPath);
    
    console.log(`FlowMark: Generated ${outputPath} from ${inputPath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
    return false;
  }
}

// Process all files in directory mode
function processDirectory() {
  try {
    if (!fs.existsSync(inputDir)) {
      console.error(`Error: Input directory '${inputDir}' not found.`);
      process.exit(1);
    }
    
    // Create output directory if it doesn't exist
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Find all markdown files
    const markdownFiles = findMarkdownFiles(inputDir, recursive);
    
    if (markdownFiles.length === 0) {
      console.log(`No markdown files found in ${inputDir}`);
      return false;
    }
    
    console.log(`Found ${markdownFiles.length} markdown files to process`);
    
    // Process each file
    let successCount = 0;
    
    markdownFiles.forEach(inputPath => {
      // Determine output path
      let outputPath;
      if (outputDir) {
        // Get the relative path from inputDir
        const relativePath = path.relative(inputDir, inputPath);
        // Replace the extension with .html
        const htmlFileName = path.basename(relativePath, path.extname(relativePath)) + '.html';
        // If we have subdirectories, preserve the structure
        if (path.dirname(relativePath) !== '.') {
          const subDir = path.dirname(relativePath);
          const fullOutputDir = path.join(outputDir, subDir);
          
          // Create subdirectories if they don't exist
          if (!fs.existsSync(fullOutputDir)) {
            fs.mkdirSync(fullOutputDir, { recursive: true });
          }
          
          outputPath = path.join(outputDir, subDir, htmlFileName);
        } else {
          outputPath = path.join(outputDir, htmlFileName);
        }
      } else {
        // Default: replace .md with .html in the same directory
        outputPath = inputPath.replace(/\.md$|\.markdown$/i, '.html');
      }
      
      if (processStoryboardFile(inputPath, outputPath)) {
        successCount++;
      }
    });
    
    console.log(`Successfully processed ${successCount}/${markdownFiles.length} files`);
    return successCount > 0;
  } catch (error) {
    console.error('Error processing directory:', error);
    return false;
  }
}

// Main processing
if (directoryMode) {
  // Process directory
  processDirectory();
  
  // Watch mode for directory
  if (watchMode) {
    console.log(`FlowMark: Watching ${inputDir} for changes (Ctrl+C to stop)...`);
    
    // Watch the directory and its contents
    fs.watch(inputDir, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.md') || filename.endsWith('.markdown'))) {
        console.log(`\nFlowMark: ${filename} changed, regenerating...`);
        processDirectory();
      }
    });
  }
} else {
  // Validate input file
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' not found.`);
    process.exit(1);
  }

  // Process single file
  const inputPath = path.resolve(inputFile);
  const outputPath = path.resolve(outputFile);
  
  processStoryboardFile(inputPath, outputPath);

  // Watch mode for single file
  if (watchMode) {
    console.log(`FlowMark: Watching ${inputFile} for changes (Ctrl+C to stop)...`);
    
    fs.watchFile(inputFile, { interval: 1000 }, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        console.log(`\nFlowMark: ${inputFile} changed, regenerating...`);
        processStoryboardFile(inputPath, outputPath);
      }
    });
  }
} 