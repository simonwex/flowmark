const { marked } = require('marked');
const fs = require('fs');

/**
 * Parses a Markdown storyboard file and returns an object with parsed data
 * @param {string} markdownContent - The raw markdown content to parse
 * @returns {Object} Parsed storyboard data
 */
function parseStoryboard(markdownContent) {
  // Parse the markdown into tokens using marked
  const tokens = marked.lexer(markdownContent);
  
  const storyboard = {
    title: '',
    scenarioDetails: {},
    steps: []
  };

  // First token should be the title (h1)
  if (tokens[0] && tokens[0].type === 'heading' && tokens[0].depth === 1) {
    storyboard.title = tokens[0].text;
  }
  
  // Find the "Scenario Details" section
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Look for the scenario details heading (h2)
    if (token.type === 'heading' && token.depth === 2 && token.text === 'Scenario Details') {
      // The next token should be a list with the details
      if (i + 1 < tokens.length && tokens[i + 1].type === 'list') {
        const detailsItems = tokens[i + 1].items;
        
        // Process each list item to extract key-value pairs
        detailsItems.forEach(item => {
          const text = item.text;
          // Match pattern like "**Persona:** Jane Doe"
          const match = text.match(/\*\*([^:]+):\*\*\s*(.*)/);
          
          if (match) {
            const [, key, value] = match;
            storyboard.scenarioDetails[key.trim()] = value.trim();
          }
        });
      }
      break;
    }
  }
  
  // For now, we're just returning the title and scenario details
  return storyboard;
}

/**
 * Generates HTML for a storyboard
 * @param {Object} storyboard - The parsed storyboard data
 * @returns {string} HTML representation of the storyboard
 */
function generateHTML(storyboard) {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${storyboard.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .storyboard-header {
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }
    .storyboard-title {
      font-size: 32px;
      margin-bottom: 16px;
    }
    .scenario-details {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .scenario-details h2 {
      margin-top: 0;
      font-size: 22px;
    }
    .scenario-details ul {
      list-style-type: none;
      padding-left: 0;
    }
    .scenario-details li {
      margin-bottom: 8px;
    }
    .scenario-details strong {
      display: inline-block;
      min-width: 80px;
    }
  </style>
</head>
<body>
  <div class="storyboard-header">
    <h1 class="storyboard-title">${storyboard.title}</h1>
    
    <div class="scenario-details">
      <h2>Scenario Details</h2>
      <ul>
        ${Object.entries(storyboard.scenarioDetails).map(([key, value]) => 
          `<li><strong>${key}:</strong> ${value}</li>`
        ).join('\n        ')}
      </ul>
    </div>
  </div>
  <!-- Steps would be added here later -->
</body>
</html>`;

  return html;
}

/**
 * Processes a markdown file and returns HTML
 * @param {string} filePath - Path to the markdown file
 * @param {string} [outputPath] - Path to write the output HTML file, if specified
 * @returns {string} Generated HTML
 */
function processFile(filePath, outputPath) {
  const markdownContent = fs.readFileSync(filePath, 'utf-8');
  const storyboard = parseStoryboard(markdownContent);
  const html = generateHTML(storyboard);
  
  if (outputPath) {
    fs.writeFileSync(outputPath, html);
  }
  
  return html;
}

module.exports = {
  parseStoryboard,
  generateHTML,
  processFile
}; 