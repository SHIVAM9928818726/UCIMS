import pandas as pd
import sqlite3

# Load Excel file using full path
df = pd.read_excel(r"C:\Users\gaurs\OneDrive\Documents\Excel_dataset\Final_Dataset_with_Reality_Score (1).xlsx")

# Connect to SQLite database
import os
conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), "..", "colleges.db"))

# Convert Excel data into database table
df.to_sql("colleges", conn, if_exists="replace", index=False)

conn.close()

print("Data successfully imported!")