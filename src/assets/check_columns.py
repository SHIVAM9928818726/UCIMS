import sqlite3

conn = sqlite3.connect("colleges.db")
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(colleges)")
columns = cursor.fetchall()

for col in columns:
    print(col)

conn.close()