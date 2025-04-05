const { parseStoryboard } = require('../index');
const fs = require('fs');
const path = require('path');

const exampleMdPath = path.join(__dirname, '..', 'example.md');
const exampleMd = fs.readFileSync(exampleMdPath, 'utf-8');

describe('Storyboard Parser', () => {
  let storyboard;
  
  beforeAll(() => {
    storyboard = parseStoryboard(exampleMd);
  });

  describe('Title parsing', () => {
    test('should extract the title from h1', () => {
      expect(storyboard.title).toBe('Password Reset Flow');
    });
  });

  describe('Scenario Details parsing', () => {
    test('should extract scenario details from the list', () => {
      expect(storyboard.scenarioDetails).toHaveProperty('Persona');
      expect(storyboard.scenarioDetails).toHaveProperty('Scenario');
      expect(storyboard.scenarioDetails).toHaveProperty('Goal');
      
      expect(storyboard.scenarioDetails.Persona).toBe('Jane Doe, infrequent user (40s, uses app monthly)');
      expect(storyboard.scenarioDetails.Scenario).toBe('Jane needs to reset her password because she forgot it, but she also forgot the answer to her security question.');
      expect(storyboard.scenarioDetails.Goal).toBe('Successfully reset password and log in.');
    });
  });

  // We'll add step parsing tests once that functionality is implemented
  describe('Steps parsing', () => {
    test('should extract steps with their number, title, visual and caption', () => {
      expect(storyboard.steps).toHaveLength(2);
      
      // Check first step
      expect(storyboard.steps[0].stepNumber).toBe(1);
      expect(storyboard.steps[0].title).toBe('Step 1: Login Attempt Failed');
      expect(storyboard.steps[0].visual).toBeTruthy();
      expect(storyboard.steps[0].visual).toContain('Jane sits at her messy home office desk');
      expect(storyboard.steps[0].caption).toHaveProperty('Action');
      expect(storyboard.steps[0].caption).toHaveProperty('Emotion');
      expect(storyboard.steps[0].caption).toHaveProperty('Thought');
      expect(storyboard.steps[0].caption).toHaveProperty('Environment');
      
      // Check second step
      expect(storyboard.steps[1].stepNumber).toBe(2);
      expect(storyboard.steps[1].title).toBe('Step 2: Initiates Password Reset');
      expect(storyboard.steps[1].visual).toBeTruthy();
      expect(storyboard.steps[1].caption).toHaveProperty('Action');
      expect(storyboard.steps[1].caption).toHaveProperty('Emotion');
      expect(storyboard.steps[1].caption).toHaveProperty('Thought');
      expect(storyboard.steps[1].caption).toHaveProperty('Environment');
    });
    
    test('should sort steps by number regardless of order in markdown', () => {
      // Create a test with steps out of order
      const outOfOrderMarkdown = `# Test Storyboard
      
## Scenario Details
* **Persona:** Test User

## Step 2: Second Step
> **Visual:** Second visual.
> **Caption:**
> * **Action:** Second action.

## Step 1: First Step
> **Visual:** First visual.
> **Caption:**
> * **Action:** First action.
`;
      
      const parsed = parseStoryboard(outOfOrderMarkdown);
      expect(parsed.steps).toHaveLength(2);
      expect(parsed.steps[0].stepNumber).toBe(1);
      expect(parsed.steps[1].stepNumber).toBe(2);
    });
  });
  
  describe('Error handling', () => {
    test('should handle empty markdown gracefully', () => {
      const result = parseStoryboard('');
      expect(result).toHaveProperty('title', '');
      expect(result).toHaveProperty('scenarioDetails');
      expect(result).toHaveProperty('steps');
    });
    
    test('should handle markdown with only title', () => {
      const result = parseStoryboard('# Just a Title');
      expect(result.title).toBe('Just a Title');
      expect(result.scenarioDetails).toEqual({});
    });
  });
}); 