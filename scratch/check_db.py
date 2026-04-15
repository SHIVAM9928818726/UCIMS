import sqlite3
import os

DATABASE = 'colleges.db'
conn = sqlite3.connect(DATABASE)
conn.row_factory = sqlite3.Row
c = conn.cursor()

c.execute("SELECT College_Name, UG_fee, Avg_package, Highest_package FROM colleges LIMIT 20")
rows = c.fetchall()

print(f"{'College Name':<40} | {'UG fee':<15} | {'Avg Pkg':<10} | {'Max Pkg':<10}")
print("-" * 85)
for row in rows:
    print(f"{str(row['College_Name']):<40} | {str(row['UG_fee']):<15} | {str(row['Avg_package']):<10} | {str(row['Highest_package']):<10}")

conn.close()
