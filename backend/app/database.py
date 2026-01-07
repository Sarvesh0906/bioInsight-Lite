from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://bioinsight_db_user:yOtD9zNjyBCY2EsFYkkKOu4e2iM0XCmp@dpg-d5f796shg0os7380aj40-a/bioinsight_db"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)
