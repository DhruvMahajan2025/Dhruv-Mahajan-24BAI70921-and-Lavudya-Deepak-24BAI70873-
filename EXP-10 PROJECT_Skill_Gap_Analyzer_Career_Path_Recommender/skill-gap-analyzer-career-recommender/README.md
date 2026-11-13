# SkillPath — Skill Gap Analyzer & Career Path Recommender

A beginner-friendly full-stack project that compares a user's current skills with a target career, calculates a match score, identifies missing skills, suggests a learning roadmap, and recommends career paths.

## Tech stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express
- Data: Built-in sample career/skill dataset (no database or API key required)

## Requirements
- Node.js 18 or newer
- Visual Studio Code

## Run the project
1. Extract the ZIP file.
2. Open the extracted `skill-gap-analyzer-career-recommender` folder in VS Code.
3. Open the VS Code terminal (`Terminal > New Terminal`).
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Open this URL in your browser:

   `http://localhost:5000`

## Features
- Add and remove skills dynamically.
- Select a target career.
- Calculate a skill-match percentage.
- View matched skills and missing skills.
- Get a suggested learning roadmap.
- Receive the top three career recommendations based on entered skills.
- Responsive, clean dashboard interface.

## Project structure

```text
skill-gap-analyzer-career-recommender/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
├── server.js
└── README.md
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/careers` | Returns available career paths |
| POST | `/api/analyze` | Compares skills against a selected career |
| POST | `/api/recommend` | Returns the top three matching careers |

### Example request

`POST /api/analyze`

```json
{
  "skills": ["Python", "SQL", "Statistics"],
  "careerId": "data"
}
```

## Notes
- The project uses a sample dataset so it works immediately after installation.
- Skill matching is case-insensitive.
- The match percentage is calculated as: `(number of matched role skills / total role skills) × 100`.
- This is an educational prototype. Recommendations are based on the included skill lists, not a live job-market feed.
