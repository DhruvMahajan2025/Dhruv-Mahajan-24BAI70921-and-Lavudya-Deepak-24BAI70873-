const skills = [];
let careers = [];
const $ = id => document.getElementById(id);

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

function renderSkills() {
  const container = $("skillTags");
  container.innerHTML = "";
  if (!skills.length) {
    container.innerHTML = '<span class="empty-skills">Your skills will appear here.</span>';
    return;
  }
  skills.forEach((skill, index) => {
    const chip = document.createElement("span");
    chip.className = "skill-chip";
    chip.append(document.createTextNode(skill));
    const remove = document.createElement("button");
    remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", `Remove ${skill}`);
    remove.addEventListener("click", () => { skills.splice(index, 1); renderSkills(); });
    chip.append(remove); container.append(chip);
  });
}

function addSkill() {
  const input = $("skillInput");
  const value = input.value.trim().replace(/\s+/g, " ");
  if (!value) return;
  if (skills.some(s => s.toLowerCase() === value.toLowerCase())) {
    $("status").textContent = "That skill has already been added."; return;
  }
  skills.push(value); input.value = ""; $("status").textContent = ""; renderSkills(); input.focus();
}

$("addSkill").addEventListener("click", addSkill);
$("skillInput").addEventListener("keydown", e => { if (e.key === "Enter") addSkill(); });

async function loadCareers() {
  try {
    careers = await request("/api/careers");
    $("careerSelect").innerHTML = '<option value="">Select a career path</option>' +
      careers.map(c => `<option value="${c.id}">${c.title}</option>`).join("");
  } catch (error) { $("status").textContent = error.message; }
}

$("careerSelect").addEventListener("change", () => {
  const career = careers.find(c => c.id === $("careerSelect").value);
  $("careerDescription").textContent = career ? career.description : "Select a role to see what it involves.";
});

$("analyzeBtn").addEventListener("click", async () => {
  $("status").textContent = "";
  if (!skills.length) { $("status").textContent = "Add at least one skill before analyzing."; return; }
  if (!$("careerSelect").value) { $("status").textContent = "Choose a target career role first."; return; }
  try {
    const data = await request("/api/analyze", { method: "POST", body: JSON.stringify({ skills, careerId: $("careerSelect").value }) });
    $("analysisEmpty").classList.add("hidden");
    $("analysisResult").classList.remove("hidden");
    $("resultCareer").textContent = data.career;
    $("scoreValue").textContent = `${data.score}%`;
    $("progressBar").style.width = `${data.score}%`;
    $("matchedCount").textContent = `${data.matched.length} skills matched`;
    $("missingCount").textContent = `${data.missing.length} skills to develop`;
    $("matchedSkills").innerHTML = data.matched.length ? data.matched.map(s => `<span class="result-tag">${escapeHtml(s)}</span>`).join("") : '<span class="muted">No matching skills yet</span>';
    $("missingSkills").innerHTML = data.missing.length ? data.missing.map(s => `<span class="result-tag missing">${escapeHtml(s)}</span>`).join("") : '<span class="muted">No gaps identified</span>';
    $("roadmapList").innerHTML = data.roadmap.map(step => `<li>${escapeHtml(step)}</li>`).join("");
  } catch (error) { $("status").textContent = error.message; }
});

$("recommendBtn").addEventListener("click", async () => {
  $("status").textContent = "";
  if (!skills.length) { $("status").textContent = "Add at least one skill to get recommendations."; return; }
  try {
    const results = await request("/api/recommend", { method: "POST", body: JSON.stringify({ skills }) });
    $("recommendationEmpty").classList.add("hidden");
    $("recommendationList").innerHTML = results.map(c => `
      <article class="recommendation-card">
        <div class="recommendation-top"><div><h4>${escapeHtml(c.title)}</h4><p>${escapeHtml(c.category)} · ${escapeHtml(c.description)}</p></div><span class="match-pill">${c.score}% match</span></div>
        <div class="match-skills">${c.matched.length ? `Matching skills: ${c.matched.map(escapeHtml).join(", ")}` : "Build foundational skills to move toward this role."}</div>
      </article>`).join("");
  } catch (error) { $("status").textContent = error.message; }
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

loadCareers();