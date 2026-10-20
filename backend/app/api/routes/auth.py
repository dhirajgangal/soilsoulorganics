"""Register, log in, log out, and reset a forgotten password."""

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    PasswordChange,
    ProfileUpdate,
    RegisterRequest,
    ResetPasswordRequest,
    UserRead,
)
from app.services.auth import (
    AuthError,
    change_password,
    login_user,
    logout_user,
    register_user,
    request_password_reset,
    reset_password,
    update_profile,
)

router = APIRouter(tags=["auth"])

RESET_MESSAGE = "If an account exists for that email, a reset link is on its way."


@router.post("/auth/register", response_model=AuthResponse, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        token, user = register_user(db, data)
    except AuthError as error:
        raise HTTPException(status_code=400, detail=error.message) from error
    return AuthResponse(token=token, user=UserRead.model_validate(user))


@router.post("/auth/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        token, user = login_user(db, data)
    except AuthError as error:
        raise HTTPException(status_code=401, detail=error.message) from error
    return AuthResponse(token=token, user=UserRead.model_validate(user))


@router.post("/auth/logout", response_model=MessageResponse)
def logout(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
) -> MessageResponse:
    logout_user(db, authorization)
    return MessageResponse(message="You are logged out.")


@router.post("/auth/forgot-password", response_model=MessageResponse)
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    request_password_reset(db, data)
    return MessageResponse(message=RESET_MESSAGE)


@router.post("/auth/reset-password", response_model=MessageResponse)
def reset_forgotten_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    try:
        reset_password(db, data)
    except AuthError as error:
        raise HTTPException(status_code=400, detail=error.message) from error
    return MessageResponse(message="Your password has been updated. You can log in now.")


@router.get("/account/me", response_model=UserRead)
def read_profile(user: User = Depends(get_current_user)) -> User:
    return user


@router.patch("/account/me", response_model=UserRead)
def edit_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> User:
    try:
        return update_profile(db, user, data)
    except AuthError as error:
        raise HTTPException(status_code=400, detail=error.message) from error


@router.post("/account/password", response_model=MessageResponse)
def edit_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    authorization: str | None = Header(default=None),
) -> MessageResponse:
    try:
        change_password(db, user, data, authorization)
    except AuthError as error:
        raise HTTPException(status_code=400, detail=error.message) from error
    return MessageResponse(message="Your password has been updated.")
