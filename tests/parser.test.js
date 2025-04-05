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
  describe('Steps array', () => {
    test('should initialize an empty steps array', () => {
      expect(storyboard.steps).toBeInstanceOf(Array);
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