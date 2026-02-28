# SPOM Practice Portal — CA Final

A CBT (Computer-Based Test) simulator for CA Final SPOM exam preparation. Hosted via GitHub Pages.

## Live Site

After enabling GitHub Pages, your site will be at:
`https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

## How to Add or Edit Questions

**All questions live in `questions.js`** — this is the only file you need to edit.

### Adding a New Case

Copy this template and add it to the `QUESTIONS` array in `questions.js`:

```js
{
  id: "C011",                          // Unique ID — increment from last
  set: "A",                            // "A" = Corporate & Economic Laws
                                       // "B" = Strategic Cost & Performance Mgmt
  chapter: "Your Chapter Name",        // Shown in results breakdown
  difficulty: "Medium",                // "Easy" | "Medium" | "Hard"
  scenario: `Your case facts here.
Multi-line is supported.
Use backtick strings.`,
  questions: [
    {
      qid: "C011Q1",                   // Must be unique — caseId + Q + number
      text: "Your question text here?",
      options: [
        "Option A text",               // Index 0
        "Option B text",               // Index 1
        "Option C text",               // Index 2
        "Option D text"                // Index 3
      ],
      correct: 1,                      // 0=A, 1=B, 2=C, 3=D
      explanation: "Why this answer is correct. Shown in Practice Mode."
    },
    {
      qid: "C011Q2",
      text: "Second question for same case?",
      options: ["A", "B", "C", "D"],
      correct: 0,
      explanation: "Explanation here."
    }
  ]
}
```

### Rules
- `id` must be unique across all cases
- `qid` must be unique across all questions
- `correct` is **0-indexed**: 0=A, 1=B, 2=C, 3=D
- `set` must be exactly `"A"` or `"B"` (case-sensitive)
- Each case can have 1–5 questions

---

## Hosting on GitHub Pages

1. Create a new GitHub repository (can be private or public)
2. Upload both files: `index.html` and `questions.js`
3. Go to **Settings → Pages**
4. Under **Source**, select `Deploy from a branch`
5. Choose `main` branch, `/ (root)` folder → Click **Save**
6. Wait ~60 seconds → your site is live

### Updating Questions Later

1. Edit `questions.js` locally
2. Commit and push to GitHub
3. Site updates automatically within ~30 seconds

---

## File Structure

```
/
├── index.html      ← Main app (don't edit unless fixing UI bugs)
├── questions.js    ← All questions (edit this to add/update content)
└── README.md       ← This file
```

---

*Not affiliated with ICAI. For practice purposes only.*
