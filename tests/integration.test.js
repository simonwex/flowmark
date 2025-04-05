const { processFile } = require('../index');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Integration Tests', () => {
  let tempDir;
  let tempInputPath;
  let tempOutputPath;
  const sampleMarkdown = `# Test Storyboard
  
## Scenario Details
* **Persona:** Test User
* **Scenario:** Testing the markdown parser
* **Goal:** Ensure everything works

---

## Step 1: First Step

> **Visual:** Description of visual.

> **Caption:**
> *   **Action:** User does something.
> *   **Emotion:** User feels something.
`;

  beforeEach(() => {
    // Create a temporary directory for test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'storyboard-tests-'));
    tempInputPath = path.join(tempDir, 'test-input.md');
    tempOutputPath = path.join(tempDir, 'test-output.html');
    
    // Write test markdown to temp file
    fs.writeFileSync(tempInputPath, sampleMarkdown);
  });

  afterEach(() => {
    // Clean up temp files
    if (fs.existsSync(tempInputPath)) {
      fs.unlinkSync(tempInputPath);
    }
    if (fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath);
    }
    fs.rmdirSync(tempDir);
  });

  test('should process a markdown file and generate HTML', () => {
    // Mock the path to our temp files in test environment
    const originalReadFileSync = fs.readFileSync;
    const originalWriteFileSync = fs.writeFileSync;

    // Override readFileSync and writeFileSync to use our temp paths
    fs.readFileSync = jest.fn((path, options) => {
      if (path === 'test-input.md') {
        return sampleMarkdown;
      }
      return originalReadFileSync(path, options);
    });

    fs.writeFileSync = jest.fn((path, data) => {
      if (path === 'test-output.html') {
        return originalWriteFileSync(tempOutputPath, data);
      }
      return originalWriteFileSync(path, data);
    });

    // Process the file
    const html = processFile('test-input.md', 'test-output.html');
    
    // Check if the HTML was generated correctly
    expect(html).toBeTruthy();
    expect(html).toContain('Test Storyboard');
    expect(html).toContain('Test User');
    
    // Check if file was written correctly
    expect(fs.existsSync(tempOutputPath)).toBeTruthy();
    const fileContent = fs.readFileSync(tempOutputPath, 'utf-8');
    expect(fileContent).toBe(html);

    // Restore the original functions
    fs.readFileSync = originalReadFileSync;
    fs.writeFileSync = originalWriteFileSync;
  });
}); 