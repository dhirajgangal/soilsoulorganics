"""JSON for register, login, profile, and password reset."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


def clean_name(value: str) -> str:
    cleaned = value.strip()
    if not 2 <= len(cleaned) <= 120:
        raise ValueError("Enter a name between 2 and 120 characters.")
    return cleaned


def clean_phone(value: str) -> str:
    digits = "".join(character for character in value if character.isdigit())
    if not 10 <= len(digits) <= 15:
        raise ValueError("Enter a phone number with 10 to 15 digits.")
    return digits


class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    token: str
    user: UserRead


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str = Field(min_length=8, max_length=128)

    @field_validator("name")
    @classmethod
    def check_name(cls, value: str) -> str:
        return clean_name(value)

    @field_validator("phone")
    @classmethod
    def check_phone(cls, value: str) -> str:
        return clean_phone(value)

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()


class ForgotPasswordRequest(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=10, max_length=200)
    password: str = Field(min_length=8, max_length=128)


class ProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: str

    @field_validator("name")
    @classmethod
    def check_name(cls, value: str) -> str:
        return clean_name(value)

    @field_validator("phone")
    @classmethod
    def check_phone(cls, value: str) -> str:
        return clean_phone(value)

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()


class PasswordChange(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class MessageResponse(BaseModel):
    message: str
