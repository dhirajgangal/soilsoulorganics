"""Order JSON shapes.

OrderCreate is what the browser is allowed to send.
It has no price and no payment status. The server fills those in.
"""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_serializer, field_validator


class OrderItemCreate(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1, le=99)


class OrderCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str
    notes: str | None = None
    items: list[OrderItemCreate] = Field(min_length=1)

    @field_validator("customer_name")
    @classmethod
    def check_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not 2 <= len(cleaned) <= 120:
            raise ValueError("Enter a name between 2 and 120 characters.")
        return cleaned

    @field_validator("phone")
    @classmethod
    def check_phone(cls, value: str) -> str:
        digits = "".join(character for character in value if character.isdigit())
        if not 10 <= len(digits) <= 15:
            raise ValueError("Enter a phone number with 10 to 15 digits.")
        return digits

    @field_validator("address_line")
    @classmethod
    def check_address(cls, value: str) -> str:
        cleaned = value.strip()
        if not 5 <= len(cleaned) <= 255:
            raise ValueError("Enter a delivery address between 5 and 255 characters.")
        return cleaned

    @field_validator("city", "state")
    @classmethod
    def check_place(cls, value: str) -> str:
        cleaned = value.strip()
        if not 2 <= len(cleaned) <= 80:
            raise ValueError("Enter between 2 and 80 characters.")
        return cleaned

    @field_validator("postal_code")
    @classmethod
    def check_postal_code(cls, value: str) -> str:
        cleaned = value.strip()
        if not 4 <= len(cleaned) <= 10:
            raise ValueError("Enter a postal code of 4 to 10 characters.")
        return cleaned

    @field_validator("notes")
    @classmethod
    def check_notes(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        if len(cleaned) > 500:
            raise ValueError("Keep the delivery note under 500 characters.")
        return cleaned or None


class OrderItemRead(BaseModel):
    product_id: int
    product_name: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal

    model_config = ConfigDict(from_attributes=True)

    @field_serializer("unit_price", "line_total")
    def serialize_money(self, value: Decimal) -> str:
        return f"{Decimal(value):.2f}"


class OrderRead(BaseModel):
    id: int
    customer_name: str
    email: EmailStr
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str
    notes: str | None
    status: str
    subtotal: Decimal
    total: Decimal
    created_at: datetime
    items: list[OrderItemRead]

    model_config = ConfigDict(from_attributes=True)

    @field_serializer("subtotal", "total")
    def serialize_money(self, value: Decimal) -> str:
        return f"{Decimal(value):.2f}"
