import sqlite3

# Connect to database (creates agri_credit.db if it doesn't exist)
conn = sqlite3.connect("agri_credit.db")
cursor = conn.cursor()

# 1️⃣ Farmer Profile
cursor.execute("""
CREATE TABLE IF NOT EXISTS farmer_profile (
    farmer_id TEXT PRIMARY KEY,
    land_size REAL,
    irrigation_type TEXT
)
""")

# 2️⃣ Crop History
cursor.execute("""
CREATE TABLE IF NOT EXISTS crop_history (
    farmer_id TEXT,
    crop_type TEXT,
    avg_yield REAL,
    yield_stability_score REAL,
    crop_diversity_index REAL
)
""")

# 3️⃣ Soil Health
cursor.execute("""
CREATE TABLE IF NOT EXISTS soil_health (
    farmer_id TEXT,
    soil_ph REAL,
    organic_carbon REAL,
    soil_fertility_score REAL
)
""")

# 4️⃣ Weather Data
cursor.execute("""
CREATE TABLE IF NOT EXISTS weather_data (
    farmer_id TEXT,
    rainfall_deviation REAL,
    drought_frequency REAL,
    temperature_variability_index REAL
)
""")

# 5️⃣ Financial Data
cursor.execute("""
CREATE TABLE IF NOT EXISTS financial_data (
    farmer_id TEXT,
    loan_amount REAL,
    loan_to_land_ratio REAL
)
""")

# 6️⃣ Credit Target
cursor.execute("""
CREATE TABLE IF NOT EXISTS credit_target (
    farmer_id TEXT,
    past_default INTEGER
)
""")

# 7️⃣ Trust Scores
cursor.execute("""
CREATE TABLE IF NOT EXISTS trust_scores (
    farmer_id TEXT,
    default_probability REAL,
    trust_score REAL
)
""")

conn.commit()
conn.close()
print("Database and tables created successfully ✅")