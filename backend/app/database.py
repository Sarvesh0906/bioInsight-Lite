from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:saR007%40123%24@localhost:3306/chembl_36"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
