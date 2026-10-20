"""Create accounts, check passwords, and issue login or reset tokens."""

from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import hash_password, hash_token, new_token, verify_password
from app.models.user import AuthToken, User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    PasswordChange,
    ProfileUpdate,
    RegisterRequest,
    ResetPasswordRequest,
)
from app.services.mail import send_password_reset

SESSION_DAYS = 14
RESET_MINUTES = 30


class AuthError(Exception):
    def __init__(self, message: str) -> None:
        self.message = message


def _bearer_value(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        return None
    return token.strip()


def user_from_authorization(db: Session, authorization: str | None) -> User | None:
    raw_token = _bearer_value(authorization)
    if raw_token is None:
        return None
    now = datetime.now(timezone.utc)
    row = (
        db.query(AuthToken)
        .filter(
            AuthToken.token_hash == hash_token(raw_token),
            AuthToken.purpose == "session",
        )
        .one_or_none()
    )
    if row is None:
        return None
    expires_at = row.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= now:
        db.delete(row)
        db.commit()
        return None
    return db.get(User, row.user_id)


def _start_session(db: Session, user: User) -> str:
    raw_token = new_token()
    db.add(
        AuthToken(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            purpose="session",
            expires_at=datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS),
        )
    )
    db.commit()
    return raw_token


def register_user(db: Session, data: RegisterRequest) -> tuple[str, User]:
    existing = db.query(User).filter(User.email == data.email).one_or_none()
    if existing is not None:
        raise AuthError("An account with this email already exists.")
    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _start_session(db, user), user


def login_user(db: Session, data: LoginRequest) -> tuple[str, User]:
    user = db.query(User).filter(User.email == data.email).one_or_none()
    if user is None or not verify_password(data.password, user.password_hash):
        raise AuthError("Email or password is incorrect.")
    return _start_session(db, user), user


def logout_user(db: Session, authorization: str | None) -> None:
    raw_token = _bearer_value(authorization)
    if raw_token is None:
        return
    row = (
        db.query(AuthToken)
        .filter(AuthToken.token_hash == hash_token(raw_token), AuthToken.purpose == "session")
        .one_or_none()
    )
    if row is not None:
        db.delete(row)
        db.commit()


def request_password_reset(db: Session, data: ForgotPasswordRequest) -> None:
    user = db.query(User).filter(User.email == data.email).one_or_none()
    if user is None:
        return
    raw_token = new_token()
    db.add(
        AuthToken(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            purpose="reset",
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=RESET_MINUTES),
        )
    )
    db.commit()
    frontend = get_settings().frontend_url.rstrip("/")
    send_password_reset(user.email, f"{frontend}/reset-password?token={raw_token}")


def reset_password(db: Session, data: ResetPasswordRequest) -> None:
    now = datetime.now(timezone.utc)
    row = (
        db.query(AuthToken)
        .filter(AuthToken.token_hash == hash_token(data.token), AuthToken.purpose == "reset")
        .one_or_none()
    )
    if row is None:
        raise AuthError("This reset link is invalid or has expired.")
    expires_at = row.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    user = db.get(User, row.user_id)
    if user is None or expires_at <= now:
        db.delete(row)
        db.commit()
        raise AuthError("This reset link is invalid or has expired.")
    user.password_hash = hash_password(data.password)
    db.query(AuthToken).filter(AuthToken.user_id == user.id).delete()
    db.commit()


def update_profile(db: Session, user: User, data: ProfileUpdate) -> User:
    taken = (
        db.query(User)
        .filter(User.email == data.email, User.id != user.id)
        .one_or_none()
    )
    if taken is not None:
        raise AuthError("An account with this email already exists.")
    user.name = data.name
    user.email = data.email
    user.phone = data.phone
    db.commit()
    db.refresh(user)
    return user


def change_password(db: Session, user: User, data: PasswordChange, authorization: str | None) -> None:
    if not verify_password(data.current_password, user.password_hash):
        raise AuthError("The current password is incorrect.")
    user.password_hash = hash_password(data.new_password)
    current = _bearer_value(authorization)
    current_hash = hash_token(current) if current else None
    tokens = db.query(AuthToken).filter(AuthToken.user_id == user.id).all()
    for token in tokens:
        if token.token_hash != current_hash:
            db.delete(token)
    db.commit()
