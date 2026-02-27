from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from datetime import datetime

# ---------------------------------------
# Initialize Flask App
# ---------------------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------------------
# Load Trained Model
# ---------------------------------------
model = joblib.load("credit_model.pkl")
model_features = list(model.feature_names_in_)

# ---------------------------------------
# In-Memory Storage (Hackathon Demo)
# ---------------------------------------
prediction_history = []

# ---------------------------------------
# Trust Score Logic (4 Risk Levels)
# ---------------------------------------
def calculate_trust_score(input_df):
    probability = float(model.predict_proba(input_df)[0][1])
    trust_score = float((1 - probability) * 100)

    if trust_score >= 90:
        risk = "No Risk"
    elif trust_score >= 75:
        risk = "Low Risk"
    elif trust_score >= 55:
        risk = "Medium Risk"
    else:
        risk = "High Risk"

    return round(trust_score, 2), round(probability, 4), risk


# ---------------------------------------
# Home Route
# ---------------------------------------
@app.route("/")
def home():
    return jsonify({
        "message": "🌾 Agricultural Loan Credit Scorer API Running",
        "status": "online"
    })


# ---------------------------------------
# Prediction Route
# ---------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # ---------------- VALIDATION ----------------
        required_fields = [
            "land_size",
            "loan_amount",
            "soil_fertility_score",
            "yield_stability_score",
            "rainfall_deviation",
            "crop_type"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        # ---------------- INPUTS ----------------
        land_size = float(data["land_size"])
        loan_amount = float(data["loan_amount"])
        soil_pct = float(data["soil_fertility_score"])
        yield_pct = float(data["yield_stability_score"])
        rainfall = float(data["rainfall_deviation"])
        crop_type = data["crop_type"]

        if land_size <= 0:
            return jsonify({"error": "Land size must be greater than 0"}), 400

        # ---------------- CONVERSIONS ----------------
        soil = soil_pct / 100
        yield_stability = yield_pct / 100
        loan_to_land_ratio = loan_amount / land_size

        # ---------------- DERIVED INDICES ----------------
        financial_stress_index = loan_to_land_ratio / 20000
        weather_risk_index = abs(rainfall) / 50
        soil_productivity_index = (soil + yield_stability) / 2
        farm_strength_index = ((land_size / 100) + soil) / 2
        income_stability_score = soil * yield_stability

        # ---------------- MODEL INPUT ----------------
        input_dict = {
            "land_size": land_size,
            "avg_yield": 3.5,
            "yield_stability_score": yield_stability,
            "crop_diversity_index": 0.5,
            "soil_ph": 6.5,
            "organic_carbon": 1.2,
            "soil_fertility_score": soil,
            "rainfall_deviation": rainfall,
            "drought_frequency": 1,
            "temperature_variability_index": 0.3,
            "loan_to_land_ratio": loan_to_land_ratio,
            "irrigation_type": "Drip",
            "crop_type": crop_type
        }

        df = pd.DataFrame([input_dict])
        df = pd.get_dummies(df)
        df = df.reindex(columns=model_features, fill_value=0)

        trust_score, probability, risk = calculate_trust_score(df)

        # ---------------- RESPONSE OBJECT ----------------
        result = {
            "farmer_name": data.get("farmer_name", "Unknown"),
            "district": data.get("district", "N/A"),
            "trust_score": trust_score,
            "default_probability": probability,
            "risk_category": risk,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "indices": {
                "financial_stress_index": round(financial_stress_index, 3),
                "weather_risk_index": round(weather_risk_index, 3),
                "soil_productivity_index": round(soil_productivity_index, 3),
                "farm_strength_index": round(farm_strength_index, 3),
                "income_stability_score": round(income_stability_score, 3)
            }
        }

        # Save to memory
        prediction_history.insert(0, result)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------
# Get Prediction History
# ---------------------------------------
@app.route("/history", methods=["GET"])
def history():
    return jsonify(prediction_history)


# ---------------------------------------
# Dashboard Statistics
# ---------------------------------------
@app.route("/stats", methods=["GET"])
def stats():
    total = len(prediction_history)

    high = sum(1 for x in prediction_history if x["risk_category"] == "High Risk")
    medium = sum(1 for x in prediction_history if x["risk_category"] == "Medium Risk")
    low = sum(1 for x in prediction_history if x["risk_category"] == "Low Risk")
    no_risk = sum(1 for x in prediction_history if x["risk_category"] == "No Risk")

    return jsonify({
        "total_reviewed": total,
        "risk_distribution": {
            "high": high,
            "medium": medium,
            "low": low,
            "no_risk": no_risk
        }
    })


# ---------------------------------------
# Run Server
# ---------------------------------------
if __name__ == "__main__":
    app.run(debug=True)