from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import Base, LiveList

DATABASE_URL = 'mysql+pymysql://user:password@localhost/dbname'
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def initialize_db():
    Base.metadata.create_all(engine)

def add_item_to_db(item):
    session.add(item)
    session.commit()

def update_item_in_db(item):
    session.merge(item)
    session.commit()

def delete_item_from_db(item_id):
    item = session.query(LiveList).filter_by(id=item_id).first()
    if item:
        session.delete(item)
        session.commit()
        return True
    return False

def get_all_items_from_db():
    return session.query(LiveList).all()

def get_item_by_id(item_id):
    return session.query(LiveList).filter_by(id=item_id).first()

def get_item_by_url_or_name(url_or_name):
    return session.query(LiveList).filter((LiveList.url == url_or_name) | (LiveList.name == url_or_name)).first()
