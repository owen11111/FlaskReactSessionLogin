from flask import Flask, jsonify, request, session
from flask_cors import CORS
import sqlite3
from dotenv import load_dotenv
from os import getenv

load_dotenv("SECRET.env")

app = Flask(__name__)
app.secret_key = (getenv("API_KEY"))

CORS(app, supports_credentials=True)

@app.route("/login", methods=["POST"])
def login():
    conn = sqlite3.connect("main.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    data = request.get_json()
    
    student = cur.execute(
        "SELECT s_id, s_pword FROM student WHERE s_uname = ?", 
        (data["uname"],)
    ).fetchone()
    
    conn.close()

    # Note the use of a truthy check here 
    if student and (student["s_pword"] == data["pword"]):
        session["s_id"] = student["s_id"]
        return jsonify({"success": True, "username":session["s_id"]}), 200
    return jsonify({"success":False, "message":"Invalid Username Or Password"}), 401


@app.route("/check", methods=["GET"])
def check():
    if "s_id" in session:
        conn = sqlite3.connect("main.db")
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        
        student = cur.execute("SELECT s_uname FROM student WHERE s_id = ?", (session["s_id"],)).fetchone()
        conn.close()

        if student:
            return jsonify({"loggedIn": True, "username": student["s_uname"]}), 200

    return jsonify({"loggedIn": False}), 401
    

if __name__ == "__main__":
    app.run()