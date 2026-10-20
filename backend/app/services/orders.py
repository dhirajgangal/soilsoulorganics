"""Creates an order from product rows stored in PostgreSQL.

The browser sends product ids and quantities only. Prices come from
the products table so the customer cannot choose their own price.
"""

from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate


class OrderError(Exception):
    """A problem with the order that the shopper can fix."""

    def __init__(self, message: str) -> None:
        self.message = message


def create_order(db: Session, data: OrderCreate, user: User | None = None) -> Order:
    quantities: dict[int, int] = {}
    for item in data.items:
        quantities[item.product_id] = quantities.get(item.product_id, 0) + item.quantity

    for product_id, quantity in quantities.items():
        if quantity > 99:
            raise OrderError("You can order up to 99 of each product.")

    products = db.query(Product).filter(Product.id.in_(quantities.keys())).all()
    products_by_id = {product.id: product for product in products}
    missing_ids = [product_id for product_id in quantities if product_id not in products_by_id]
    if missing_ids:
        raise OrderError("One of the products in your cart is no longer available.")

    order = Order(
        user_id=user.id if user is not None else None,
        customer_name=data.customer_name,
        email=data.email,
        phone=data.phone,
        address_line=data.address_line,
        city=data.city,
        state=data.state,
        postal_code=data.postal_code,
        notes=data.notes,
        status="pending_payment",
        subtotal=Decimal("0.00"),
        total=Decimal("0.00"),
    )

    subtotal = Decimal("0.00")
    for product_id, quantity in quantities.items():
        product = products_by_id[product_id]
        unit_price = Decimal(product.price).quantize(Decimal("0.01"))
        if unit_price <= 0:
            raise OrderError(f"{product.name} does not have a selling price yet.")
        line_total = (unit_price * quantity).quantize(Decimal("0.01"))
        subtotal += line_total
        order.items.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                unit_price=unit_price,
                quantity=quantity,
                line_total=line_total,
            )
        )

    # Shipping is not calculated yet, so the total matches the subtotal.
    order.subtotal = subtotal
    order.total = subtotal

    db.add(order)
    db.commit()
    db.refresh(order)
    return order
