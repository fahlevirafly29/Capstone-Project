import { predictJob, getSampleData } from "../controllers/predictionController.js";
import express from "express";

const router = express.Router();

// Health check endpoint (cek koneksi FE-BE)
router.get("/health", (req, res) => {
    res.json({
        status: "success",
        message: "Backend is running and connected!",
        timestamp: new Date().toISOString()
    });
});

// GET semua dummy sample data
router.get("/samples", getSampleData);

// POST prediksi pekerjaan
router.post("/predict", predictJob);

export default router;