"""Orders, addresses, and wishlist for the signed-in customer."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.account import AddressCreate, AddressRead, WishlistItemRead
from app.schemas.auth import MessageResponse
from app.schemas.order import OrderRead
from app.services.account import (
    AccountError,
    add_address,
    add_wishlist_item,
    delete_address,
    list_addresses,
    list_orders,
    list_wishlist,
    make_default_address,
    remove_wishlist_item,
)

router = APIRouter(tags=["account"])


def _account_error(error: AccountError) -> HTTPException:
    return HTTPException(status_code=400, detail=error.message)


@router.get("/account/orders", response_model=list[OrderRead])
def my_orders(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list:
    return list_orders(db, user)


@router.get("/account/addresses", response_model=list[AddressRead])
def my_addresses(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list:
    return list_addresses(db, user)


@router.post("/account/addresses", response_model=AddressRead, status_code=201)
def create_address(
    data: AddressCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> AddressRead:
    try:
        return add_address(db, user, data)
    except AccountError as error:
        raise _account_error(error) from error


@router.delete("/account/addresses/{address_id}", response_model=MessageResponse)
def remove_address(
    address_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> MessageResponse:
    try:
        delete_address(db, user, address_id)
    except AccountError as error:
        raise _account_error(error) from error
    return MessageResponse(message="Address removed.")


@router.post("/account/addresses/{address_id}/default", response_model=AddressRead)
def choose_default_address(
    address_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> AddressRead:
    try:
        return make_default_address(db, user, address_id)
    except AccountError as error:
        raise _account_error(error) from error


@router.get("/account/wishlist", response_model=list[WishlistItemRead])
def my_wishlist(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list:
    return list_wishlist(db, user)


@router.post("/account/wishlist/{product_id}", response_model=MessageResponse, status_code=201)
def save_wishlist_item(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> MessageResponse:
    try:
        add_wishlist_item(db, user, product_id)
    except AccountError as error:
        raise _account_error(error) from error
    return MessageResponse(message="Saved to your wishlist.")


@router.delete("/account/wishlist/{product_id}", response_model=MessageResponse)
def drop_wishlist_item(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> MessageResponse:
    remove_wishlist_item(db, user, product_id)
    return MessageResponse(message="Removed from your wishlist.")
