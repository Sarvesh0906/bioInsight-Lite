from sqlalchemy import create_engine, text

# add your database connection details here
# DATABASE_URL = "postgresql+psycopg2://cleanadmin:password@localhost:5432/chembl_36"

DATABASE_URL = "mysql+pymysql://root:saR007%40123%24@localhost:3306/chembl_36"

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print("DB connected ✅", result.fetchone())
