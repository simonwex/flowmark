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
  if (tokens.length > 0 && tokens[0].type === 'heading' && tokens[0].depth === 1) {
    storyboard.title = tokens[0].text;
  }
  
  // Find all headings to identify major sections and steps
  let currentStep = null;
  let inScenarioDetails = false;
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Process headings (sections)
    if (token.type === 'heading' && token.depth === 2) {
      if (token.text === 'Scenario Details') {
        inScenarioDetails = true;
        currentStep = null;
      } else if (token.text.match(/^Step\s+\d+:/)) {
        // Start a new step
        inScenarioDetails = false;
        const stepNumMatch = token.text.match(/Step\s+(\d+):/);
        const stepNumber = stepNumMatch ? parseInt(stepNumMatch[1], 10) : 0;
        
        currentStep = {
          title: token.text,
          stepNumber: stepNumber,
          visual: '',
          caption: {}
        };
        
        storyboard.steps.push(currentStep);
      } else {
        // Other h2 heading - reset state
        inScenarioDetails = false;
        currentStep = null;
      }
      continue;
    }
    
    // Process content based on current section
    if (inScenarioDetails) {
      // Parse scenario details from list
      if (token.type === 'list') {
        token.items.forEach(item => {
          const match = item.text.match(/\*\*([^:]+):\*\*\s*(.*)/);
          if (match) {
            const [, key, value] = match;
            storyboard.scenarioDetails[key.trim()] = value.trim();
          }
        });
      }
    } else if (currentStep) {
      // Process current step
      
      // Visual and caption sections are in blockquotes
      if (token.type === 'blockquote') {
        // Get the first line of the blockquote to determine if it's Visual or Caption
        const firstLine = token.tokens[0].text.trim();
        
        if (firstLine.startsWith('**Visual:**')) {
          currentStep.visual = firstLine.replace(/^\*\*Visual:\*\*\s*/, '').trim();
        } else if (firstLine.startsWith('**Caption:**')) {
          // The caption section may contain a list with details
          for (let j = 0; j < token.tokens.length; j++) {
            if (token.tokens[j].type === 'list') {
              token.tokens[j].items.forEach(item => {
                const match = item.text.match(/\*\*([^:]+):\*\*\s*(.*)/);
                if (match) {
                  const [, key, value] = match;
                  currentStep.caption[key.trim()] = value.trim();
                }
              });
            }
          }
        }
      }
    }
  }
  
  // Sort steps by number
  storyboard.steps.sort((a, b) => a.stepNumber - b.stepNumber);
  
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
      margin: 0;
      padding: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .flowmark-header {
      padding: 20px;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10;
    }
    .flowmark-title {
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
    .steps-container {
      flex: 1;
      display: flex;
      overflow-x: auto;
      padding: 20px;
      gap: 20px;
      scroll-behavior: smooth;
    }
    .step-card {
      flex: 0 0 400px;
      max-width: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    .step-title {
      font-size: 20px;
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .step-number {
      background: #007BFF;
      color: white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
    }
    .visual-section {
      margin-bottom: 15px;
    }
    .visual-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .visual-description {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      font-style: italic;
    }
    .caption-section {
      margin-top: auto;
    }
    .caption-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .caption-item {
      margin-bottom: 8px;
    }
    .caption-key {
      font-weight: bold;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="flowmark-header">
    <h1 class="flowmark-title">${storyboard.title}</h1>
    
    <div class="scenario-details">
      <h2>Scenario Details</h2>
      <ul>
        ${Object.entries(storyboard.scenarioDetails).map(([key, value]) => 
          `<li><strong>${key}:</strong> ${value}</li>`
        ).join('\n        ')}
      </ul>
    </div>
  </div>
  
  <div class="steps-container">
    ${storyboard.steps.map(step => `
      <div class="step-card">
        <h3 class="step-title"><span class="step-number">${step.stepNumber}</span>${step.title.replace(/^Step\s+\d+:\s*/, '')}</h3>
        
        <div class="visual-section">
          <div class="visual-title">Visual:</div>
          <div class="visual-description">${step.visual}</div>
        </div>
        
        <div class="caption-section">
          <div class="caption-title">Caption:</div>
          ${Object.entries(step.caption).map(([key, value]) => `
            <div class="caption-item">
              <span class="caption-key">${key}:</span> ${value}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </div>
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