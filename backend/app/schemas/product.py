"""Product JSON shapes returned by the API."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, field_serializer


class ProductRead(BaseModel):
    id: int
    name: str
    description: str
    # Sent as a string such as "349.00" so the browser does not round it.
    price: Decimal

    model_config = ConfigDict(from_attributes=True)

    @field_serializer("price")
    def serialize_price(self, value: Decimal) -> str:
        return f"{Decimal(value):.2f}"
