import sqlite3
import csv

# Connect to your database
conn = sqlite3.connect("agri_credit.db")
cursor = conn.cursor()

# Get full dataset by joining tables
query = """
SELECT fp.farmer_id, fp.land_size, fp.irrigation_type,
       ch.crop_type, ch.avg_yield, ch.yield_stability_score, ch.crop_diversity_index,
       sh.soil_ph, sh.organic_carbon, sh.soil_fertility_score,
       wd.rainfall_deviation, wd.drought_frequency, wd.temperature_variability_index,
       fd.loan_amount, fd.loan_to_land_ratio,
       ct.past_default
FROM farmer_profile fp
LEFT JOIN crop_history ch ON fp.farmer_id = ch.farmer_id
LEFT JOIN soil_health sh ON fp.farmer_id = sh.farmer_id
LEFT JOIN weather_data wd ON fp.farmer_id = wd.farmer_id
LEFT JOIN financial_data fd ON fp.farmer_id = fd.farmer_id
LEFT JOIN credit_target ct ON fp.farmer_id = ct.farmer_id
"""

cursor.execute(query)
rows = cursor.fetchall()

# CSV headers
headers = [
    "farmer_id", "land_size", "irrigation_type",
    "crop_type", "avg_yield", "yield_stability_score", "crop_diversity_index",
    "soil_ph", "organic_carbon", "soil_fertility_score",
    "rainfall_deviation", "drought_frequency", "temperature_variability_index",
    "loan_amount", "loan_to_land_ratio",
    "past_default"
]

# Write to CSV
with open("farmers_dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

conn.close()
print("✅ Dataset exported to farmers_dataset.csv")