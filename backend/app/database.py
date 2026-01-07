from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# DATABASE_URL = "mysql+pymysql://root:saR007%40123%24@localhost:3306/chembl_36"
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(bind=engine)


DATABASE_URL = "sqlite:///./data/chembl.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)