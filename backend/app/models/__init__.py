"""Database tables. Importing them here lets Alembic discover every model."""

from app.models.order import Order, OrderItem
from app.models.product import Product

__all__ = ["Order", "OrderItem", "Product"]
