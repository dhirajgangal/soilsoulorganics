"""The orders and order_items tables.

An order is the customer's delivery request. Each order item is one
line in that order. Prices are copied onto the line when the order is
placed, so later product price changes do not rewrite old orders.
"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base

# Delivery progress, in the order a parcel moves through them.
# "cancelled" can replace any step before "delivered".
ORDER_STEPS = ("placed", "confirmed", "shipped", "out_for_delivery", "delivered")
ORDER_STATUSES = ORDER_STEPS + ("cancelled",)

# Cash on delivery is the only method until a payment gateway is added.
PAYMENT_METHODS = ("cod",)
PAYMENT_STATUSES = ("pending", "paid")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    # Set when the shopper is logged in. Guest orders leave this empty.
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    customer_name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    address_line = Column(String(255), nullable=False)
    city = Column(String(80), nullable=False)
    state = Column(String(80), nullable=False)
    postal_code = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)
    # One of ORDER_STATUSES. Checkout always starts at "placed".
    status = Column(String(40), nullable=False, default="placed")
    payment_method = Column(String(20), nullable=False, default="cod", server_default="cod")
    # Checkout never sets "paid". For cash on delivery, the shop marks it
    # paid only after the cash is collected (python -m app.db.order_status).
    payment_status = Column(String(20), nullable=False, default="pending", server_default="pending")
    subtotal = Column(Numeric(10, 2), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(120), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    line_total = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
