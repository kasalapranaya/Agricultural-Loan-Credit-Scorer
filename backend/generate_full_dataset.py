import sqlite3
import random

# ----------------------------------------
# Connect to Database
# ----------------------------------------
conn = sqlite3.connect("agri_credit.db")
cursor = conn.cursor()

# Clear tables
tables = [
    "farmer_profile",
    "crop_history",
    "soil_health",
    "weather_data",
    "financial_data",
    "credit_target"
]

for table in tables:
    cursor.execute(f"DELETE FROM {table}")

# ----------------------------------------
# 1️⃣ Farmer Profile (UI Range Aligned)
# ----------------------------------------
irrigation_types = ["Drip", "Sprinkler", "Flood"]
farmers = []

for i in range(1, 1001):
    farmer_id = f"F{i:04d}"
    land_size = round(random.uniform(1, 100), 2)  # 1–100 acres
    irrigation_type = random.choice(irrigation_types)

    farmers.append((farmer_id, land_size, irrigation_type))

cursor.executemany(
    "INSERT INTO farmer_profile VALUES (?, ?, ?)", farmers
)

# ----------------------------------------
# 2️⃣ Crop History
# ----------------------------------------
crop_types = ["Wheat", "Rice", "Maize", "Cotton", "Soybean"]
crop_history = []

for farmer_id, land_size, _ in farmers:
    crop_type = random.choice(crop_types)
    avg_yield = round(random.uniform(1.0, 5.0), 2)
    yield_stability_score = round(random.uniform(0, 1), 2)
    crop_diversity_index = round(random.uniform(0, 1), 2)

    crop_history.append(
        (farmer_id, crop_type, avg_yield,
         yield_stability_score, crop_diversity_index)
    )

cursor.executemany(
    "INSERT INTO crop_history VALUES (?, ?, ?, ?, ?)",
    crop_history
)

# ----------------------------------------
# 3️⃣ Soil Health
# ----------------------------------------
soil_health = []

for farmer_id, _, _ in farmers:
    soil_ph = round(random.uniform(4.5, 8.5), 1)
    organic_carbon = round(random.uniform(0.5, 3.5), 2)
    soil_fertility_score = round(random.uniform(0, 1), 2)

    soil_health.append(
        (farmer_id, soil_ph, organic_carbon, soil_fertility_score)
    )

cursor.executemany(
    "INSERT INTO soil_health VALUES (?, ?, ?, ?)",
    soil_health
)

# ----------------------------------------
# 4️⃣ Weather Data
# ----------------------------------------
weather_data = []

for farmer_id, _, _ in farmers:
    rainfall_deviation = round(random.uniform(-50, 50), 1)
    drought_frequency = round(random.uniform(0, 5), 1)
    temperature_variability_index = round(random.uniform(0, 1), 2)

    weather_data.append(
        (farmer_id, rainfall_deviation,
         drought_frequency, temperature_variability_index)
    )

cursor.executemany(
    "INSERT INTO weather_data VALUES (?, ?, ?, ?)",
    weather_data
)

# ----------------------------------------
# 5️⃣ Financial Data (UI Range Aligned)
# ----------------------------------------
financial_data = []

for farmer_id, land_size, _ in farmers:
    loan_amount = round(random.uniform(5000, 1000000), 2)  # 5k–10L
    loan_to_land_ratio = round(loan_amount / land_size, 2)

    financial_data.append(
        (farmer_id, loan_amount, loan_to_land_ratio)
    )

cursor.executemany(
    "INSERT INTO financial_data VALUES (?, ?, ?)",
    financial_data
)

# ----------------------------------------
# 6️⃣ Financial-Dominant Risk Logic
# ----------------------------------------
credit_target = []

for i in range(len(farmers)):

    rainfall_deviation = weather_data[i][1]
    drought_frequency = weather_data[i][2]
    loan_to_land_ratio = financial_data[i][2]
    soil_fertility_score = soil_health[i][3]
    yield_stability_score = crop_history[i][3]

    # Normalize values
    normalized_rainfall = abs(rainfall_deviation) / 50
    normalized_drought = drought_frequency / 5
    normalized_loan_ratio = loan_to_land_ratio / 50000   # 🔥 no cap
    normalized_soil = 1 - soil_fertility_score
    normalized_yield = 1 - yield_stability_score

    # Financial-dominant risk formula
    risk_score = (
        0.15 * normalized_rainfall +
        0.10 * normalized_drought +
        0.40 * normalized_loan_ratio +   # 🔥 finance strongest
        0.20 * normalized_soil +
        0.15 * normalized_yield
    )

    # Realistic threshold
    past_default = 1 if risk_score > 0.7 else 0

    credit_target.append((farmers[i][0], past_default))

cursor.executemany(
    "INSERT INTO credit_target VALUES (?, ?)",
    credit_target
)

conn.commit()
conn.close()

print("Financial-dominant dataset generated successfully ✅")