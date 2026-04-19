import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "agri_credit.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def create_users_table():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT
        )
    """)

    conn.commit()
    conn.close()

def create_loan_applications_table():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS loan_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_name TEXT,
            district TEXT,
            land_size REAL,
            crop_type TEXT,
            irrigation_type TEXT,
            soil_fertility_score REAL,
            yield_stability_score REAL,
            rainfall_deviation REAL,
            loan_amount REAL,
            trust_score REAL,
            risk_category TEXT,
            status TEXT DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()