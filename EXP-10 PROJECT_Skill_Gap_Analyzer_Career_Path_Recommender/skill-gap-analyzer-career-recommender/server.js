const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const careers = [
  { id: "frontend", title: "Frontend Developer", category: "Software Development", skills: ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design"], description: "Builds the interfaces and experiences people use on websites and web apps.", roadmap: ["Strengthen HTML and CSS fundamentals", "Practice JavaScript and DOM manipulation", "Build projects with React", "Learn Git, accessibility and responsive design"] },
  { id: "backend", title: "Backend Developer", category: "Software Development", skills: ["Java", "SQL", "REST APIs", "Node.js", "Git", "Data Structures"], description: "Develops server-side logic, APIs, databases and application infrastructure.", roadmap: ["Choose Java or Node.js and master the fundamentals", "Learn SQL and database design", "Build and test REST APIs", "Practice data structures and deployment"] },
  { id: "data", title: "Data Analyst", category: "Data & Analytics", skills: ["Python", "SQL", "Excel", "Statistics", "Power BI", "Data Visualization"], description: "Turns data into useful insights through analysis, reporting and visualization.", roadmap: ["Learn Excel and SQL for data exploration", "Practice Python with Pandas", "Study descriptive statistics", "Create dashboards and portfolio case studies"] },
  { id: "ml", title: "Machine Learning Engineer", category: "AI & Machine Learning", skills: ["Python", "Statistics", "Linear Algebra", "Machine Learning", "Pandas", "TensorFlow"], description: "Builds, evaluates and deploys models that learn patterns from data.", roadmap: ["Build strong Python and mathematics foundations", "Learn Pandas and data preparation", "Study core machine learning algorithms", "Train, evaluate and deploy end-to-end models"] },
  { id: "cyber", title: "Cybersecurity Analyst", category: "Cybersecurity", skills: ["Networking", "Linux", "Python", "Security Fundamentals", "SIEM", "Incident Response"], description: "Monitors systems, investigates threats and helps protect digital assets.", roadmap: ["Understand networking and operating systems", "Practice Linux and scripting", "Learn security concepts and common attacks", "Use security labs and study incident response"] },
  { id: "cloud", title: "Cloud Engineer", category: "Cloud & DevOps", skills: ["Linux", "Networking", "AWS", "Docker", "CI/CD", "Scripting"], description: "Builds and maintains reliable cloud infrastructure and deployment workflows.", roadmap: ["Learn Linux, networking and scripting", "Understand cloud fundamentals with AWS", "Containerize apps with Docker", "Practice CI/CD and infrastructure monitoring"] }
];

app.get("/api/careers", (req, res) => res.json(careers.map(({ id, title, category, skills, description }) => ({ id, title, category, skills, description }))));

app.post("/api/analyze", (req, res) => {
  const selected = careers.find(c => c.id === req.body.careerId);
  if (!selected) return res.status(400).json({ error: "Please select a valid career path." });
  const userSkills = [...new Set((req.body.skills || []).map(s => String(s).trim().toLowerCase()).filter(Boolean))];
  const matched = selected.skills.filter(s => userSkills.includes(s.toLowerCase()));
  const missing = selected.skills.filter(s => !userSkills.includes(s.toLowerCase()));
  const score = Math.round((matched.length / selected.skills.length) * 100);
  res.json({ career: selected.title, score, matched, missing, roadmap: selected.roadmap });
});

app.post("/api/recommend", (req, res) => {
  const userSkills = [...new Set((req.body.skills || []).map(s => String(s).trim().toLowerCase()).filter(Boolean))];
  if (!userSkills.length) return res.status(400).json({ error: "Add at least one skill to get recommendations." });
  const results = careers.map(c => {
    const matched = c.skills.filter(s => userSkills.includes(s.toLowerCase()));
    return { id: c.id, title: c.title, category: c.category, description: c.description, matched, score: Math.round(matched.length / c.skills.length * 100) };
  }).sort((a, b) => b.score - a.score || b.matched.length - a.matched.length).slice(0, 3);
  res.json(results);
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`Skill Gap Analyzer running at http://localhost:${PORT}`));