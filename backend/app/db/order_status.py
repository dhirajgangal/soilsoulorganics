"""Move an order along its delivery steps from the server.

Run these from the backend folder:

    python -m app.db.order_status                     list the 20 newest orders
    python -m app.db.order_status 12 confirmed        set order 12 to "confirmed"
    python -m app.db.order_status 12 delivered --cash-collected

Steps: placed, confirmed, shipped, out_for_delivery, delivered, cancelled.
--cash-collected marks a cash on delivery order as paid. Use it only
after the courier or shop has the money.
"""

import argparse

from app.db.session import SessionLocal
from app.models.order import ORDER_STATUSES, Order


def list_orders() -> None:
    db = SessionLocal()
    try:
        orders = db.query(Order).order_by(Order.created_at.desc()).limit(20).all()
        if not orders:
            print("No orders yet.")
            return
        for order in orders:
            print(
                f"#{order.id}  {order.created_at:%d %b %Y %H:%M}  {order.status:<17}"
                f"{order.payment_method}/{order.payment_status:<8}  Rs {order.total}  "
                f"{order.customer_name}, {order.city}"
            )
    finally:
        db.close()


def set_status(order_id: int, status: str, cash_collected: bool) -> None:
    db = SessionLocal()
    try:
        order = db.get(Order, order_id)
        if order is None:
            raise SystemExit(f"Order {order_id} does not exist.")
        if cash_collected and order.payment_method != "cod":
            raise SystemExit("--cash-collected is only for cash on delivery orders.")
        if cash_collected and status != "delivered":
            raise SystemExit("Cash is collected on delivery, so use it with the delivered step.")

        order.status = status
        if cash_collected:
            order.payment_status = "paid"
        db.commit()
        print(f"Order {order.id} is now {order.status}, payment {order.payment_status}.")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="List orders or change an order's delivery step.")
    parser.add_argument("order_id", nargs="?", type=int, help="Order number")
    parser.add_argument("status", nargs="?", choices=ORDER_STATUSES, help="New delivery step")
    parser.add_argument(
        "--cash-collected",
        action="store_true",
        help="Mark a cash on delivery order as paid",
    )
    args = parser.parse_args()

    if args.order_id is None:
        list_orders()
        return
    if args.status is None:
        parser.error("Give the new step after the order number.")
    set_status(args.order_id, args.status, args.cash_collected)


if __name__ == "__main__":
    main()
