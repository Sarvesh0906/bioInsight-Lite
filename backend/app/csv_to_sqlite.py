import pandas as pd
import sqlite3
from pathlib import Path

# Resolve backend directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Paths
DATA_DIR = BASE_DIR / "data"
CSV_PATH = DATA_DIR / "bioactivity.csv"
DB_PATH = DATA_DIR / "chembl.db"

# Ensure data directory exists
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Load CSV
df = pd.read_csv(CSV_PATH)

# Create SQLite DB
conn = sqlite3.connect(DB_PATH)
df.to_sql("bioactivity", conn, if_exists="replace", index=False)
conn.close()

print("✅ SQLite DB created successfully at:", DB_PATH)
print("📊 Rows inserted:", len(df))
