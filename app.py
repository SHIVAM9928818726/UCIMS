from flask import Flask, jsonify, request, g         #g → stores database connection temporarily for each request
from flask_cors import CORS
import sqlite3
import os                                  #os → handles file paths

app = Flask(__name__) # creates flask app
# Explicitly allow the origin to avoid "dead" connection issues
CORS(app)
app.secret_key = 'ucims_super_secret_key'
DATABASE = os.path.join(os.path.dirname(__file__), 'colleges.db')         #DATABASE stores the path of colleges.db


# Database Connection Functions
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Close Database After Request
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)  #If connection already exists in g, reuse it.
    if db is not None:
        db.close()

# Get Database Function
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = get_db_connection()
    return db

#Home Route
@app.route("/")
def index():
    return jsonify({"status": "UCIMS API is running", "version": "1.0.0"})


#/api/colleges Route (Main Dataset Fetch)
@app.route("/api/colleges")
def get_colleges():
    db = get_db()
    c = db.cursor()
    
    #It fetches colleges based on filters:
    search = request.args.get('search', '')
    tier = request.args.get('tier', '')
    type_ = request.args.get('college_type', '') # Alignment with Home.jsx
    course = request.args.get('course', '')
    sort = request.args.get('sort', '')
    
    #SQL Query Creation
    query = 'SELECT rowid as id, College_Name, City, State, Tier, UG_Course, PG_Course, UG_fee, PG_fee, College_Type, Avg_package, Highest_package, "User Rating (out of 5)" as User_Rating, "Reality_score(1-10)" as Reality_score FROM colleges WHERE 1=1'  #WHERE 1=1 means: always true, so you can easily add filters.
    params = []
    
    #Adding Filters Dynamically
    if search:
        query += " AND (College_Name LIKE ? OR City LIKE ? OR State LIKE ?)"
        params.extend(['%'+search+'%', '%'+search+'%', '%'+search+'%'])
    if tier:
        query += " AND LOWER(Tier) = LOWER(?)"
        params.append(tier)
    if type_:
        query += " AND LOWER(College_Type) = LOWER(?)"
        params.append(type_)
    if course:
        query += " AND (LOWER(UG_Course) LIKE LOWER(?) OR LOWER(PG_Course) LIKE LOWER(?))"
        params.extend(['%'+course+'%', '%'+course+'%'])

    if sort == "ug_fee": query += " ORDER BY CAST(UG_fee AS INTEGER) ASC"
    elif sort == "avg_package": query += " ORDER BY CAST(Avg_package AS INTEGER) DESC"
    elif sort == "highest_package": query += " ORDER BY CAST(Highest_package AS INTEGER) DESC"
    elif sort == "rating": query += ' ORDER BY CAST("User Rating (out of 5)" AS INTEGER) DESC'
    elif sort == "reality_score": query += ' ORDER BY CAST("Reality_score(1-10)" AS REAL) DESC'
    elif sort == "tier": query += " ORDER BY Tier ASC"
    else: query += ' ORDER BY CAST("Reality_score(1-10)" AS REAL) DESC'
    


   #executes query
   #converts each row to dictionary
   #returns JSON list to React
    c.execute(query, params)
    results = [dict(ix) for ix in c.fetchall()]
    return jsonify(results)



    # This route gives summary numbers:
    # total colleges
    # total states
    # tier1 count
    # tier2 count
    # tier3 count  Used for dashboard cards.
@app.route("/api/stats")
def get_stats():
    db = get_db()
    c = db.cursor()
    c.execute("SELECT COUNT(*) FROM colleges")
    total_colleges = c.fetchone()[0]
    
    c.execute("SELECT COUNT(DISTINCT State) FROM colleges")
    total_states = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM colleges WHERE Tier='Tier 1'")
    total_tier1 = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM colleges WHERE Tier='Tier 2'")
    total_tier2 = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM colleges WHERE Tier='Tier 3'")
    total_tier3 = c.fetchone()[0]

    return jsonify({
        "total_colleges": total_colleges,
        "total_states": total_states,
        "total_tier1": total_tier1,
        "total_tier2": total_tier2,
        "total_tier3": total_tier3,
        "total_courses": 45 # Placeholder or dynamic if needed
    })



#  Returns only :-
# id,  College_Name,  Used for dropdown list (compare feature).

@app.route("/api/all_colleges")
def get_all_colleges():
    db = get_db()
    c = db.cursor()
    c.execute('SELECT rowid as id, College_Name, City, State FROM colleges ORDER BY College_Name')
    return jsonify([dict(ix) for ix in c.fetchall()])


#This API compares 2 colleges.
@app.route("/api/compare")
def compare_api():
    db = get_db()
    c = db.cursor()
    col1_id = request.args.get('college1')
    col2_id = request.args.get('college2')

    college1 = None
    college2 = None
    query = 'SELECT rowid as id, College_Name, City, State, Tier, UG_Course, PG_Course, UG_fee, PG_fee, College_Type, Avg_package, Highest_package, "User Rating (out of 5)" as User_Rating, "Reality_score(1-10)" as Reality_score FROM colleges WHERE rowid = ?'

    if col1_id:
        c.execute(query, (col1_id,))
        row = c.fetchone()
        if row: college1 = dict(row)

    if col2_id:
        c.execute(query, (col2_id,))
        row = c.fetchone()
        if row: college2 = dict(row)

    return jsonify({"college1": college1, "college2": college2})


#Right now it returns hardcoded data, not dataset.
#So it does NOT fetch from database.
@app.route("/api/latest_updates")
def get_updates():
    # Placeholder updates for the UI
    data = [
        {"id": 1, "day": "22", "month": "APR", "title": "Admission 2026 Open", "desc": "Top tier colleges have opened portals."},
        {"id": 2, "day": "15", "month": "MAY", "title": "Scholarship Deadline", "desc": "Apply for merit-based scholarships by end of month."}
    ]
    return jsonify(data)

@app.route("/api/college/<int:id>")
def get_college_detail(id):
    db = get_db()
    c = db.cursor()
    query = 'SELECT rowid as id, College_Name, City, State, Tier, UG_Course, PG_Course, UG_fee, PG_fee, College_Type, Avg_package, Highest_package, "User Rating" as User_Rating, "Reality_score(1-10)" as Reality_score FROM colleges WHERE rowid = ?'
    c.execute(query, (id,))
    row = c.fetchone()
    if row:
        return jsonify(dict(row))
    return jsonify({"error": "Not found"}), 404

#Rating API (POST)
@app.route("/api/college/<int:id>/rate", methods=["POST"])
def rate_college(id):
    db = get_db()
    c = db.cursor()
    data = request.json
    new_rating = data.get("rating")
    if new_rating is None:
        return jsonify({"error": "No rating provided"}), 400
        
    query = 'UPDATE colleges SET "User Rating (out of 5)" = ? WHERE rowid = ?'
    c.execute(query, (new_rating, id))
    db.commit()
    return jsonify({"success": True, "new_rating": new_rating})

# --- USER MANAGEMENT API ---

@app.route("/api/users")
def get_users():
    db = get_db()
    c = db.cursor()
    c.execute("SELECT * FROM users ORDER BY id DESC")
    results = [dict(ix) for ix in c.fetchall()]
    return jsonify(results)

@app.route("/api/users", methods=["POST"])
def add_user():
    db = get_db()
    c = db.cursor()
    data = request.json
    try:
        c.execute('''
            INSERT INTO users (name, email, role, status, joined, lastLogin)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['name'], data['email'], data['role'], data['status'], data['joined'], data['lastLogin']))
        db.commit()
        return jsonify({"success": True, "id": c.lastrowid})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    db = get_db()
    c = db.cursor()
    c.execute("DELETE FROM users WHERE id = ?", (id,))
    db.commit()
    return jsonify({"success": True})

@app.route("/api/users/<int:id>/toggle-status", methods=["PATCH"])
def toggle_user_status(id):
    db = get_db()
    c = db.cursor()
    c.execute("SELECT status FROM users WHERE id = ?", (id,))
    row = c.fetchone()
    if not row:
        return jsonify({"error": "User not found"}), 404
    
    new_status = "Blocked" if row['status'] == "Active" else "Active"
    c.execute("UPDATE users SET status = ? WHERE id = ?", (new_status, id))
    db.commit()
    return jsonify({"success": True, "new_status": new_status})

# --- END USER MANAGEMENT API ---

#Run Flask Server
if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)

