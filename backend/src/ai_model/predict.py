import sys
import json
import joblib

# Load model
model = joblib.load("ai_model/model.pkl")

# Ambil data dari Node.js
input_json = sys.argv[1]
data = json.loads(input_json)

# Feature extraction
features = [[
    data["age"],
    data["years_experience"],
    data["skill_score"]
]]

# Prediction
prediction = model.predict(features)

# Output ke Node.js
print(prediction[0])