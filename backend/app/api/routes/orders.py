"""Order route.

POST /api/orders    save a delivery order

There is no public "get order" route. An order contains a customer's
name, email, phone, and address, and order ids are easy to guess.
The confirmation page keeps the response in the browser instead.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_optional_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.order import OrderCreate, OrderRead
from app.services.orders import OrderError, create_order

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
