import http from "http";

const data = JSON.stringify({
    age: 27,
    years_experience: 8,
    education_level: "master",
    major: "arts",
    skill_score: 64.3
});

const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/predict",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
    }
};

const req = http.request(options, (res) => {

    res.on("data", (chunk) => {
        console.log(chunk.toString());
    });

});

req.write(data);
req.end();