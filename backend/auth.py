from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
from database import get_db_connection

auth_bp = Blueprint("auth", __name__)

# -------------------------
# SIGNUP
# -------------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]
    role = data["role"]

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            (name, email, hashed_password, role)
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"})
    except:
        return jsonify({"error": "Email already exists"}), 400
    finally:
        conn.close()


# -------------------------
# LOGIN
# -------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, password, role FROM users WHERE email=?",
        (email,)
    )
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        access_token = create_access_token(
            identity={"id": user["id"], "role": user["role"]}
        )

        return jsonify({
            "token": access_token,
            "role": user["role"]
        })

    return jsonify({"error": "Invalid credentials"}), 401