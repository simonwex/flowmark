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
    expect(html).toContain('<h1 class="flowmark-title">Test Storyboard</h1>');
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
    expect(html).toContain('<h1 class="flowmark-title"></h1>');
    expect(html).toContain('<ul>');
    expect(html).toContain('</ul>');
  });

  test('should render steps as cards in steps-container', () => {
    mockStoryboard.steps = [
      {
        title: 'Step 1: First Step',
        stepNumber: 1,
        visual: 'This is the first visual description',
        caption: {
          Action: 'User does action 1',
          Emotion: 'User feels emotion 1'
        }
      },
      {
        title: 'Step 2: Second Step',
        stepNumber: 2,
        visual: 'This is the second visual description',
        caption: {
          Action: 'User does action 2',
          Emotion: 'User feels emotion 2'
        }
      }
    ];
    
    const html = generateHTML(mockStoryboard);
    
    expect(html).toContain('<div class="steps-container">');
    
    expect(html).toContain('<div class="step-card">');
    expect(html).toContain('<span class="step-number">1</span>');
    expect(html).toContain('<span class="step-number">2</span>');
    
    expect(html).toContain('First Step');
    expect(html).toContain('Second Step');
    expect(html).toContain('This is the first visual description');
    expect(html).toContain('This is the second visual description');
    expect(html).toContain('User does action 1');
    expect(html).toContain('User feels emotion 1');
    expect(html).toContain('User does action 2');
    expect(html).toContain('User feels emotion 2');
  });
}); 