"""Shared FastAPI dependencies for the signed-in customer."""

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.services.auth import user_from_authorization


def get_optional_user(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
) -> User | None:
    """Return the logged-in customer, or None for a guest."""
    return user_from_authorization(db, authorization)


def get_current_user(user: User | None = Depends(get_optional_user)) -> User:
    if user is None:
        raise HTTPException(status_code=401, detail="Log in to continue.")
    return user
