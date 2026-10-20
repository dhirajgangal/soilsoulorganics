"""Database tables. Importing them here lets Alembic discover every model."""

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import Address, AuthToken, User, WishlistItem

__all__ = [
    "Address",
    "AuthToken",
    "Order",
    "OrderItem",
    "Product",
    "User",
    "WishlistItem",
]
