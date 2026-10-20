"""JSON for saved addresses and the wishlist."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, field_serializer, field_validator

from app.schemas.auth import clean_name, clean_phone


class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str
    is_default: bool = False

    @field_validator("full_name")
    @classmethod
    def check_name(cls, value: str) -> str:
        return clean_name(value)

    @field_validator("phone")
    @classmethod
    def check_phone(cls, value: str) -> str:
        return clean_phone(value)

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


class AddressRead(BaseModel):
    id: int
    full_name: str
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str
    is_default: bool

    model_config = ConfigDict(from_attributes=True)


class WishlistItemRead(BaseModel):
    product_id: int
    name: str
    description: str
    price: Decimal

    @field_serializer("price")
    def serialize_price(self, value: Decimal) -> str:
        return f"{Decimal(value):.2f}"
