const { generateHTML } = require('../index');

describe('HTML Generator', () => {
  let mockStoryboard;
  
  beforeEach(() => {
    mockStoryboard = {
      title: 'Test Storyboard',
      scenarioDetails: {
        Persona: 'Test User',
        Scenario: 'Test scenario description',
        Goal: 'Test goal'
      },
      steps: []
    };
  });

  test('should include the title in the generated HTML', () => {
    const html = generateHTML(mockStoryboard);
    expect(html).toContain('<title>Test Storyboard</title>');
    expect(html).toContain('<h1 class="storyboard-title">Test Storyboard</h1>');
  });

  test('should include all scenario details in the generated HTML', () => {
    const html = generateHTML(mockStoryboard);
    expect(html).toContain('<strong>Persona:</strong> Test User');
    expect(html).toContain('<strong>Scenario:</strong> Test scenario description');
    expect(html).toContain('<strong>Goal:</strong> Test goal');
  });

  test('should include required HTML elements', () => {
    const html = generateHTML(mockStoryboard);
    expect(html).toMatch(/<!DOCTYPE html>/i);
    expect(html).toMatch(/<html[\s\S]*>/i);
    expect(html).toMatch(/<head[\s\S]*>/i);
    expect(html).toMatch(/<body[\s\S]*>/i);
    expect(html).toMatch(/<style[\s\S]*>/i);
  });

  test('should handle empty storyboard object', () => {
    const emptyStoryboard = {
      title: '',
      scenarioDetails: {},
      steps: []
    };
    
    const html = generateHTML(emptyStoryboard);
    expect(html).toContain('<title></title>');
    expect(html).toContain('<h1 class="storyboard-title"></h1>');
    expect(html).toContain('<ul>');
    expect(html).toContain('</ul>');
  });
}); 