# Markdown UX Storyboard

A library to represent UX storyboards using Markdown.

## Installation

```bash
# Install from npm (when published)
npm install storyboard-md

# Or from GitHub
npm install github:yourusername/storyboard.md
```

For development:
```bash
# Clone the repository
git clone https://github.com/yourusername/storyboard.md.git
cd storyboard.md

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

## Contributing

<!-- Add contribution guidelines here --> 