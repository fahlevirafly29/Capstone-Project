const API_BASE = "http://localhost:5000/api";

// ─── Sync range ↔ number input ───────────────────────────────────────────────
function syncSkillScore(val) {
    document.getElementById("skill_score").value = val;
}
function syncSkillSlider(val) {
    document.getElementById("skill_score_slider").value = val;
}

// ─── Connection status check ──────────────────────────────────────────────────
async function checkConnection() {
    const statusEl = document.getElementById("connectionStatus");
    const labelEl = statusEl.querySelector(".status-label");

    try {
        const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
        const data = await res.json();

        statusEl.className = "connection-status connected";
        labelEl.textContent = "Backend Connected ✓";
        console.log("✅ Backend health:", data.message);

    } catch (err) {
        statusEl.className = "connection-status disconnected";
        labelEl.textContent = "Backend Disconnected ✗";
        console.error("❌ Backend connection failed:", err.message);
    }
}

// ─── Load dummy samples from backend ─────────────────────────────────────────
async function loadSamples() {
    const container = document.getElementById("samplesContainer");
    const btn = document.getElementById("loadSamplesBtn");

    btn.disabled = true;
    btn.textContent = "Loading...";

    container.innerHTML = `
        <div class="empty-state">
            <span class="loader-spin">⚙️</span>
            <p style="margin-top:10px">Mengambil data dari backend...</p>
        </div>`;

    try {
        const res = await fetch(`${API_BASE}/samples`);
        const json = await res.json();

        if (json.status !== "success") throw new Error("Response status bukan success");

        renderTable(json.data);
        btn.textContent = `Refresh (${json.total} data)`;

    } catch (err) {
        container.innerHTML = `
            <div class="empty-state" style="color:#f87171">
                <span>❌</span>
                <p style="margin-top:10px">Gagal mengambil data: ${err.message}</p>
                <p style="font-size:0.8rem;margin-top:6px">Pastikan backend berjalan di port 5000</p>
            </div>`;
        btn.textContent = "Retry";
        console.error("loadSamples error:", err);
    } finally {
        btn.disabled = false;
    }
}

function renderTable(samples) {
    const container = document.getElementById("samplesContainer");

    const rows = samples.map((s, i) => {
        const score = Number(s.skill_score);
        const pct = Math.min(score, 100);
        return `
        <tr>
            <td>${i + 1}</td>
            <td>${s.age}</td>
            <td>${s.years_experience}</td>
            <td><span class="edu-tag">${s.education_level}</span></td>
            <td>${s.major}</td>
            <td>
                <div class="score-bar-wrap">
                    <div class="score-bar-bg">
                        <div class="score-bar" style="width:${pct}%"></div>
                    </div>
                    <span>${score.toFixed(1)}</span>
                </div>
            </td>
            <td><span class="job-pill">${s.predicted_job}</span></td>
        </tr>`;
    }).join("");

    container.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Age</th>
                        <th>Exp (yr)</th>
                        <th>Education</th>
                        <th>Major</th>
                        <th>Skill Score</th>
                        <th>Predicted Job</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}

// ─── Form submission ──────────────────────────────────────────────────────────
const form = document.getElementById("predictionForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");
    const resultBox = document.getElementById("resultBox");
    const outputEl = document.getElementById("output");
    const noteEl = document.getElementById("resultNote");

    // Loading state
    submitBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");

    const data = {
        age: Number(document.getElementById("age").value),
        years_experience: Number(document.getElementById("years_experience").value),
        education_level: document.getElementById("education_level").value,
        major: document.getElementById("major").value,
        skill_score: Number(document.getElementById("skill_score").value)
    };

    try {
        const response = await fetch(`${API_BASE}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        outputEl.textContent = result.data.predicted_job;
        noteEl.textContent = result.data.note || "";
        resultBox.classList.remove("hidden");

    } catch (error) {
        outputEl.textContent = "Error connecting to backend";
        noteEl.textContent = "Pastikan server berjalan di http://localhost:5000";
        resultBox.classList.remove("hidden");
        resultBox.style.borderColor = "rgba(248,113,113,0.3)";
        resultBox.style.background = "rgba(248,113,113,0.06)";
        console.error("Prediction error:", error);

    } finally {
        submitBtn.disabled = false;
        btnText.classList.remove("hidden");
        btnLoader.classList.add("hidden");
    }
});

// ─── Init ─────────────────────────────────────────────────────────────────────
checkConnection();