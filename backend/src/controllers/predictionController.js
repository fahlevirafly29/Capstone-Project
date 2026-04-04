import { runPrediction, getSamples } from "../services/predictionService.js";

export const predictJob = async (req, res, next) => {
    try {
        const inputData = req.body;

        const result = await runPrediction(inputData);

        res.json({
            status: "success",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const getSampleData = async (req, res, next) => {
    try {
        const samples = getSamples();

        res.json({
            status: "success",
            total: samples.length,
            data: samples
        });

    } catch (error) {
        next(error);
    }
};