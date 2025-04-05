const { processFile } = require('./index');
const fs = require('fs');

// Process the example.md file
const html = processFile('example.md');

// Write the generated HTML to a file
fs.writeFileSync('example.html', html);

console.log('Storyboard HTML generated successfully as example.html'); 