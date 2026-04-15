from flask import Flask, render_template
import sqlite3

app = Flask(__name__)

@app.route("/")
def home():
    conn = sqlite3.connect("colleges.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM colleges")
    colleges = cursor.fetchall()

    conn.close()

    return render_template("index.html", colleges=colleges)

if __name__ == "__main__":
    app.run(debug=True)