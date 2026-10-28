"""Inserts the Soil Soul products and removes the old placeholder products.

Run this from the backend folder:

    python -m app.db.seed

The pack artwork does not list an M.R.P. Prices stay 0.00 until you set
them in PRODUCTS below and run this file again. Product names must match
the names in frontend/src/content/pack.js.
"""

from decimal import Decimal

from app.db.session import SessionLocal
from app.models.order import OrderItem
from app.models.product import Product

# The printed packs leave M.R.P. blank. Change a price when it is known.
PRODUCTS = [
    {
        "name": "Soil Improvement Powder",
        "description": (
            "100% organic and natural soil enhancer, suitable for all types of crops. "
            "Apply it to the soil and incorporate it uniformly during land preparation, "
            "or as recommended by an agricultural expert."
        ),
        "price": Decimal("0.00"),
    },
    {
        "name": "Soil Enhancer Granules",
        "description": "100% organic and natural soil enhancer granules, for all types of crops.",
        "price": Decimal("0.00"),
    },
]

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

        for item in PRODUCTS:
            existing = db.query(Product).filter(Product.name == item["name"]).first()
            if existing is None:
                db.add(Product(**item))
                print(f"Added {item['name']}.")
                continue
            existing.description = item["description"]
            if Decimal(existing.price) == 0 and item["price"] != 0:
                existing.price = item["price"]
            print(f"Updated {item['name']}.")

        db.commit()
        if removed:
            print(f"Removed {removed} placeholder product(s).")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
