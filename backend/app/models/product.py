"""The products table.

Each row is one product the shop can sell.
"""

from sqlalchemy import Column, Integer, Numeric, String, Text

from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)
    # Rupees with two decimal places, for example 349.00.
    price = Column(Numeric(10, 2), nullable=False)
