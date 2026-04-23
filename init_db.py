import sqlite3
import os

def init_db():
    db_path = "colleges.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create the table based on the required schema
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS colleges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            College_Name TEXT NOT NULL,
            City TEXT NOT NULL,
            State TEXT NOT NULL,
            Tier TEXT NOT NULL,
            UG_Course TEXT,
            PG_Course TEXT,
            UG_fee INTEGER,
            PG_fee INTEGER,
            College_Type TEXT NOT NULL,
            Avg_package INTEGER,
            Highest_package INTEGER,
            User_Rating REAL,
            Reality_score REAL
        )
    ''')

    # Check if we have data already
    cursor.execute("SELECT COUNT(*) FROM colleges")
    count = cursor.fetchone()[0]

    if count == 0:
        print("Inserting sample data into the database...")
        # Insert sample data to allow UI testing
        sample_data = [
            # Top Tier
            ("IIT Bombay", "Mumbai", "Maharashtra", "Top", "B.Tech CSE", "M.Tech CSE", 1000000, 500000, "Government", 2200000, 15000000, 4.9, 9.8),
            ("BITS Pilani", "Pilani", "Rajasthan", "Top", "B.E. Computer Science", "M.E. Software", 2200000, 1100000, "Private", 1800000, 6000000, 4.8, 9.5),
            ("IIT Delhi", "New Delhi", "Delhi", "Top", "B.Tech CSE", "M.Tech CSE", 900000, 400000, "Government", 2100000, 12000000, 4.8, 9.7),
            
            # Average Tier
            ("VIT Vellore", "Vellore", "Tamil Nadu", "Average", "B.Tech IT", "M.Tech IT", 1500000, 800000, "Private", 800000, 4500000, 4.2, 7.5),
            ("NIT Trichy", "Trichy", "Tamil Nadu", "Top", "B.Tech ECE", "M.Tech ECE", 800000, 350000, "Government", 1200000, 4000000, 4.5, 8.8),
            ("SRM Institute", "Chennai", "Tamil Nadu", "Average", "B.Tech CSE", "M.Tech CSE", 1800000, 900000, "Private", 700000, 4200000, 4.0, 7.0),
            
            # Low Tier
            ("ABC College of Engg", "Pune", "Maharashtra", "Low", "B.E. Mech", "", 400000, 0, "Private", 300000, 600000, 2.5, 3.5),
            ("XYZ Institute", "Bhopal", "Madhya Pradesh", "Low", "B.Tech Civil", "M.Tech Civil", 300000, 150000, "Government", 250000, 500000, 3.0, 4.0),
            ("Global College", "Bangalore", "Karnataka", "Average", "B.E. CSE", "M.Tech CSE", 1200000, 600000, "Private", 500000, 1200000, 3.8, 6.5)
        ]

        cursor.executemany('''
            INSERT INTO colleges (
                College_Name, City, State, Tier, UG_Course, PG_Course, UG_fee, PG_fee, College_Type, Avg_package, Highest_package, User_Rating, Reality_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', sample_data)
        
        conn.commit()
    
    # Create the users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL,
            status TEXT NOT NULL,
            joined TEXT NOT NULL,
            lastLogin TEXT NOT NULL
        )
    ''')

    # Check if we have users already
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]

    if user_count == 0:
        print("Inserting sample users into the database...")
        sample_users = [
            ("Shivam Gaur",    "gaurshivam775@gmail.com", "Admin",   "Active",  "2024-03-10", "Today"),
            ("Rahul Sharma",   "rahul.s@gmail.com",       "Student", "Active",  "2024-02-15", "2 days ago"),
            ("Priya Singh",    "priya.singh@gmail.com",   "Student", "Blocked", "2024-01-20", "1 week ago"),
            ("Amit Kumar",     "amit.k@gmail.com",        "Student", "Active",  "2024-04-05", "Yesterday"),
            ("Sneha Gupta",    "sneha.g@gmail.com",       "Admin",   "Active",  "2024-03-25", "3 hours ago"),
            ("Vikram Yadav",   "vikram.y@gmail.com",      "Student", "Active",  "2024-04-10", "5 hours ago"),
            ("Ananya Verma",   "ananya.v@gmail.com",      "Student", "Blocked", "2024-01-05", "2 weeks ago")
        ]
        cursor.executemany('''
            INSERT INTO users (name, email, role, status, joined, lastLogin)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', sample_users)
        conn.commit()

    conn.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
