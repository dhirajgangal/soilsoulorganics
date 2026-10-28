"""Order routes.

POST /api/orders          save a delivery order (cash on delivery)
POST /api/orders/track    delivery progress for one order

There is no public "get order by id" route. An order contains a customer's
name, email, phone, and address, and order ids are easy to guess.
Tracking needs the order number and the checkout email together, and
returns no street address, phone, or email. It is a POST so the email
does not end up in server access logs.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_optional_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.order import OrderCreate, OrderRead, OrderTrackRead, OrderTrackRequest
from app.services.orders import OrderError, create_order, find_order_for_tracking

router = APIRouter(tags=["orders"])


@router.post("/orders", response_model=OrderRead, status_code=201)
def place_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
) -> OrderRead:
    try:
        return create_order(db, order, user)
    except OrderError as error:
        raise HTTPException(status_code=400, detail=error.message) from error


@router.post("/orders/track", response_model=OrderTrackRead)
def track_order(data: OrderTrackRequest, db: Session = Depends(get_db)) -> OrderTrackRead:
    order = find_order_for_tracking(db, data.order_id, data.email)
    if order is None:
        raise HTTPException(
            status_code=404,
            detail="No order matches that order number and email.",
        )
    return order
