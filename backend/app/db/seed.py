"""Inserts Soil Improvement Powder and removes the old placeholder products.

Run this from the backend folder:

    python -m app.db.seed

The pack artwork does not list an M.R.P. The price stays 0.00 until you
set SELLING_PRICE below and run this file again.
"""

from decimal import Decimal

from app.db.session import SessionLocal
from app.models.order import OrderItem
from app.models.product import Product

# The printed pack leaves M.R.P. blank. Change this when the selling price is known.
SELLING_PRICE = Decimal("0.00")

PRODUCT = {
    "name": "Soil Improvement Powder",
    "description": (
        "100% organic and natural soil enhancer, suitable for all types of crops. "
        "Apply it to the soil and incorporate it uniformly during land preparation, "
        "or as recommended by an agricultural expert."
    ),
    "price": SELLING_PRICE,
}

OLD_PLACEHOLDERS = ("Garden Soil Blend", "Compost Blend")


def seed() -> None:
    db = SessionLocal()
    try:
        removed = 0
        for product in db.query(Product).filter(Product.name.in_(OLD_PLACEHOLDERS)).all():
            used = db.query(OrderItem).filter(OrderItem.product_id == product.id).first()
            if used is not None:
                continue
            db.delete(product)
            removed += 1

        existing = db.query(Product).filter(Product.name == PRODUCT["name"]).first()
        if existing is None:
            db.add(Product(**PRODUCT))
            print("Added Soil Improvement Powder.")
        else:
            existing.description = PRODUCT["description"]
            if Decimal(existing.price) == 0 and PRODUCT["price"] != 0:
                existing.price = PRODUCT["price"]
            print("Updated Soil Improvement Powder.")

        db.commit()
        if removed:
            print(f"Removed {removed} placeholder product(s).")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
