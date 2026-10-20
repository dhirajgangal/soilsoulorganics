"""Saved addresses, wishlist rows, and the signed-in customer's orders."""

from sqlalchemy.orm import Session, joinedload

from app.models.order import Order
from app.models.product import Product
from app.models.user import Address, User, WishlistItem
from app.schemas.account import AddressCreate, WishlistItemRead

MAX_ADDRESSES = 10


class AccountError(Exception):
    def __init__(self, message: str) -> None:
        self.message = message


def list_orders(db: Session, user: User) -> list[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


def list_addresses(db: Session, user: User) -> list[Address]:
    return (
        db.query(Address)
        .filter(Address.user_id == user.id)
        .order_by(Address.is_default.desc(), Address.id.desc())
        .all()
    )


def add_address(db: Session, user: User, data: AddressCreate) -> Address:
    count = db.query(Address).filter(Address.user_id == user.id).count()
    if count >= MAX_ADDRESSES:
        raise AccountError("You can save up to 10 addresses.")
    make_default = data.is_default or count == 0
    if make_default:
        _clear_default(db, user.id)
    address = Address(
        user_id=user.id,
        full_name=data.full_name,
        phone=data.phone,
        address_line=data.address_line,
        city=data.city,
        state=data.state,
        postal_code=data.postal_code,
        is_default=make_default,
    )
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


def delete_address(db: Session, user: User, address_id: int) -> None:
    address = _owned_address(db, user.id, address_id)
    was_default = address.is_default
    db.delete(address)
    db.commit()
    if was_default:
        replacement = (
            db.query(Address)
            .filter(Address.user_id == user.id)
            .order_by(Address.id.desc())
            .first()
        )
        if replacement is not None:
            replacement.is_default = True
            db.commit()


def make_default_address(db: Session, user: User, address_id: int) -> Address:
    address = _owned_address(db, user.id, address_id)
    _clear_default(db, user.id)
    address.is_default = True
    db.commit()
    db.refresh(address)
    return address


def list_wishlist(db: Session, user: User) -> list[WishlistItemRead]:
    rows = (
        db.query(WishlistItem)
        .options(joinedload(WishlistItem.product))
        .filter(WishlistItem.user_id == user.id)
        .order_by(WishlistItem.created_at.desc())
        .all()
    )
    return [
        WishlistItemRead(
            product_id=row.product.id,
            name=row.product.name,
            description=row.product.description,
            price=row.product.price,
        )
        for row in rows
        if row.product is not None
    ]


def add_wishlist_item(db: Session, user: User, product_id: int) -> None:
    product = db.get(Product, product_id)
    if product is None:
        raise AccountError("That product is no longer available.")
    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user.id, WishlistItem.product_id == product_id)
        .one_or_none()
    )
    if existing is not None:
        return
    db.add(WishlistItem(user_id=user.id, product_id=product_id))
    db.commit()


def remove_wishlist_item(db: Session, user: User, product_id: int) -> None:
    db.query(WishlistItem).filter(
        WishlistItem.user_id == user.id,
        WishlistItem.product_id == product_id,
    ).delete()
    db.commit()


def _owned_address(db: Session, user_id: int, address_id: int) -> Address:
    address = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == user_id)
        .one_or_none()
    )
    if address is None:
        raise AccountError("That address was not found.")
    return address


def _clear_default(db: Session, user_id: int) -> None:
    db.query(Address).filter(Address.user_id == user_id, Address.is_default.is_(True)).update(
        {Address.is_default: False}
    )
