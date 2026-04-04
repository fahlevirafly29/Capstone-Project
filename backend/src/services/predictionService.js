import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sampleData = require("../data/sampleData.json");

// Mapping aturan sederhana untuk dummy prediction
const DUMMY_RULES = [
    { keywords: ["computer", "software", "programming", "coding"], minScore: 75, job: "Software Engineer" },
    { keywords: ["data", "analytics", "statistics", "machine learning"], minScore: 80, job: "Data Scientist" },
    { keywords: ["data", "analytics", "information"], minScore: 60, job: "Data Analyst" },
    { keywords: ["design", "graphic", "ui", "ux", "creative", "arts"], minScore: 60, job: "UI/UX Designer" },
    { keywords: ["finance", "accounting", "economics"], minScore: 70, job: "Financial Analyst" },
    { keywords: ["marketing", "advertising", "communication"], minScore: 50, job: "Digital Marketer" },
    { keywords: ["business", "management", "administration"], minScore: 50, job: "Business Analyst" },
    { keywords: ["security", "cybersecurity", "network"], minScore: 70, job: "Security Engineer" },
    { keywords: ["arts", "creative", "media"], minScore: 40, job: "Content Creator" },
];

const predictFromDummy = (data) => {
    const major = (data.major || "").toLowerCase();
    const skillScore = Number(data.skill_score) || 50;

    for (const rule of DUMMY_RULES) {
        const matched = rule.keywords.some((kw) => major.includes(kw));
        if (matched && skillScore >= rule.minScore) {
            return rule.job;
        }
    }

    // Fallback berdasarkan education level
    if (data.education_level === "phd") return "Research Scientist";
    if (data.education_level === "master") return "Project Manager";
    return "General Staff";
};

export const runPrediction = async (data) => {
    try {
        // TODO: Ganti dengan Python ML model saat model.pkl sudah tersedia
        // const result = await runPythonScript(data);
        const predicted_job = predictFromDummy(data);

        return {
            predicted_job,
            note: "[DUMMY MODE] Hasil ini menggunakan logika dummy, bukan model ML asli."
        };

    } catch (error) {
        throw new Error("Prediction failed: " + error.message);
    }
};

export const getSamples = () => {
    return sampleData;
};