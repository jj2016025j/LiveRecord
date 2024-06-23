from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class LiveStream(Base):
    __tablename__ = 'live_streams'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    url = Column(String(255), unique=True, nullable=False)
    status = Column(String(50), default='offline')
    is_favorite = Column(Boolean, default=False)
    auto_record = Column(Boolean, default=False)
    viewed = Column(Boolean, default=False)
    live_stream_url = Column(String(255))
    preview_image = Column(String(255))
    create_time = Column(DateTime, default=func.now())
    last_view_time = Column(DateTime, default=func.now())
    serial_number = Column(Integer)
