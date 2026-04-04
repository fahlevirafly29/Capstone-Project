import { spawn } from "child_process";

export const runPythonScript = (data) => {
    return new Promise((resolve, reject) => {

        const pythonProcess = spawn("python", [
            "ai_model/predict.py",
            JSON.stringify(data)
        ]);

        let result = "";

        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        pythonProcess.on("close", () => {
            resolve(result.trim());
        });

    });
};