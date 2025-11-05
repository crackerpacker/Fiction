# Fiction Writing Machine - Stage 1

A minimal web app for managing novel projects, designed for writers with brain fog who need structure without complexity.

## What This Does

This is your story database. It stores:

- **Projects**: Your different novels or stories
- **Characters**: Names, physical facts, roles (NO psychology or emotions)
- **Locations**: Physical descriptions only
- **Scenes**: Story beats (what happens, not prose)

All data is stored locally in your browser AND can be saved to GitHub as backup.

## How to Use It

### On Your Computer

1. Open `index.html` in any web browser
2. Start creating projects, characters, locations, and scenes
3. Everything saves automatically to your browser

### On Your iPad (Recommended)

**Option 1: Direct File Access**
- Download this folder to your iPad
- Open `index.html` in Safari
- Add to Home Screen for app-like experience

**Option 2: GitHub Pages (Best)**
- I'll set this up for you
- You'll get a URL you can bookmark
- Access from anywhere with internet

## GitHub Backup

Your data is automatically saved in your browser, but you can back it up to GitHub:

1. Create a Personal Access Token:
   - Go to: github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name like "Fiction Machine"
   - Check the "repo" box
   - Click "Generate token"
   - Copy the token (starts with `ghp_`)

2. In the app:
   - Click the ⚙️ button (bottom right)
   - Paste your token
   - Enter repository name: `crackerpacker/Fiction`
   - Click Save

3. Use the buttons:
   - **Save to GitHub**: Backs up all your data
   - **Load from GitHub**: Restores from backup

## Tips

- Data saves automatically as you work
- Use GitHub backup regularly (it's like "Save As...")
- You can work offline, sync later
- Each project stores its own characters, locations, and scenes
- Scene numbers update automatically

## What's Next

- Stage 2: Prose generation tools (with style guardrails)
- Stage 3: Style analysis and enforcement
- Stage 4: Skills integration
- Stage 5: Polish and documentation

## Built With

Pure HTML, CSS, and JavaScript - no frameworks, no complexity, just works.
