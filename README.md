# FlowMark

A library to represent UX storyboards and user flows using Markdown.

## Installation

```bash
# Install from npm (when published)
npm install flowmark

# Or from GitHub
npm install github:yourusername/flowmark
```

For development:
```bash
# Clone the repository
git clone https://github.com/yourusername/flowmark.git
cd flowmark

# Install dependencies
npm install
```

## Usage

```markdown
# Password Reset Flow

## Scenario Details
* **Persona:** Jane Doe, infrequent user (40s, uses app monthly)
* **Scenario:** Jane needs to reset her password because she forgot it, but she also forgot the answer to her security question.
* **Goal:** Successfully reset password and log in.

---

## Step 1: Login Attempt Failed

> **Visual:** Jane sits at her messy home office desk late at night, frowning at her laptop screen which displays a prominent red "Incorrect Password" error message. She has one hand on the trackpad and the other resting on her forehead. Empty coffee mug nearby.

> **Caption:**
> *   **Action:** Enters username 'jdoe' and a guessed password. Clicks 'Log In'.
> *   **Emotion:** Annoyed, tired, slightly stressed.
> *   **Thought:** "Ugh, I thought that was it. Which password did I use for this?"
> *   **Environment:** Home office, late evening.

## Step 2: Initiates Password Reset

> **Visual:** Jane's screen now shows the password reset options. Her cursor is hovering over the "Forgot Password?" link. Her expression is neutral, focused.

> **Caption:**
> *   **Action:** Clicks the "Forgot Password?" link.
> *   **Emotion:** Neutral, task-focused.
> *   **Thought:** "Okay, let's get this over with."
> *   **Environment:** Same home office.
```

### Command Line Interface

FlowMark includes a CLI for easy conversion of Markdown files to HTML:

```bash
# Basic usage - process a single file
npx flowmark story.md

# Specify output file
npx flowmark -i story.md -o story.html

# Watch mode (auto-regenerate when file changes)
npx flowmark -w -i story.md

# Process all markdown files in a directory
npx flowmark --dir storyboards --outdir html

# Process files in a directory and its subdirectories
npx flowmark -d storyboards -r --outdir html

# Create a new storyboard from template
npx flowmark init new-story.md

# Create a new storyboard using a specific template
npx flowmark init new-mobile-story.md --template mobile

# Show help
npx flowmark --help
```

### Programmatic Usage

```javascript
const { parseStoryboard, generateHTML, processFile } = require('flowmark');

// Process a file
processFile('input.md', 'output.html');

// Or process markdown content directly
const markdown = `# My Storyboard\n## Scenario Details\n...`;
const storyboard = parseStoryboard(markdown);
const html = generateHTML(storyboard);
```

## Contributing

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/flowmark.git
cd flowmark

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- Add contribution guidelines here --> 