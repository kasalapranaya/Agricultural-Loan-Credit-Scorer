import pandas as pd
import joblib

# ---------------------------------------
# Load newly trained model
# ---------------------------------------cd
model = joblib.load("credit_model.pkl")
model_features = list(model.feature_names_in_)

# ---------------------------------------
# TEST INPUT (Matches UI Ranges)
# ---------------------------------------
api_input = {
    "land_size": 2,                 # 1–100
    "loan_amount": 50000,          # 0–10L
    "soil_fertility_score": 60,     # 0–100%
    "yield_stability_score": 20,    # 0–100%
    "rainfall_deviation": 40,        # -50 to 50
    "crop_type": "Rice"
}

# ---------------------------------------
# SAME LOGIC AS app.py
# ---------------------------------------
land_size = float(api_input["land_size"])
loan_amount = float(api_input["loan_amount"])
soil_fertility_pct = float(api_input["soil_fertility_score"])
yield_stability_pct = float(api_input["yield_stability_score"])
rainfall_deviation = float(api_input["rainfall_deviation"])
crop_type = api_input["crop_type"]

# Conversions
soil_fertility_score = soil_fertility_pct / 100
yield_stability_score = yield_stability_pct / 100
loan_to_land_ratio = loan_amount / land_size

# Derived indices (for printing only)
financial_stress_index = loan_to_land_ratio / 20000
weather_risk_index = abs(rainfall_deviation) / 50
soil_productivity_index = (soil_fertility_score + yield_stability_score) / 2
farm_strength_index = ((land_size / 100) + soil_fertility_score) / 2
income_stability_score = soil_fertility_score * yield_stability_score

# Default values (same as app.py)
input_dict = {
    "land_size": land_size,
    "avg_yield": 3.5,
    "yield_stability_score": yield_stability_score,
    "crop_diversity_index": 0.5,
    "soil_ph": 6.5,
    "organic_carbon": 1.2,
    "soil_fertility_score": soil_fertility_score,
    "rainfall_deviation": rainfall_deviation,
    "drought_frequency": 1,
    "temperature_variability_index": 0.3,
    "loan_to_land_ratio": loan_to_land_ratio,
    "irrigation_type": "Drip",
    "crop_type": crop_type
}

# ---------------------------------------
# Convert & Align
# ---------------------------------------
input_df = pd.DataFrame([input_dict])
input_df = pd.get_dummies(input_df)
input_df = input_df.reindex(columns=model_features, fill_value=0)

# ---------------------------------------
# Predict
# ---------------------------------------
probability = model.predict_proba(input_df)[0][1]
trust_score = (1 - probability) * 100

# ---------------------------------------
# Output
# ---------------------------------------
print("\n===== TEST RESULT =====")
print("Default Probability:", round(probability, 4))
print("Trust Score:", round(trust_score, 2))

risk=""
if trust_score >= 85:
    risk = "Very Low Risk"
elif trust_score >= 70:
    risk = "Low Risk"
elif trust_score >= 50:
    risk = "Moderate Risk"
else:
    risk = "High Risk"
print("Risk Category:", risk)
print("\n--- Derived Indices ---")
print("Financial Stress Index:", round(financial_stress_index, 3))
print("Weather Risk Index:", round(weather_risk_index, 3))
print("Soil Productivity Index:", round(soil_productivity_index, 3))
print("Farm Strength Index:", round(farm_strength_index, 3))
print("Income Stability Score:", round(income_stability_score, 3))