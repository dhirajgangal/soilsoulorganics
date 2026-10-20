"""Product routes.

GET /api/products          list every product
GET /api/products/{id}     one product
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.product import ProductRead
from app.services import products as product_service

router = APIRouter(tags=["products"])


@router.get("/products", response_model=list[ProductRead])
def read_products(db: Session = Depends(get_db)) -> list[ProductRead]:
    return product_service.list_products(db)


@router.get("/products/{product_id}", response_model=ProductRead)
def read_product(product_id: int, db: Session = Depends(get_db)) -> ProductRead:
    product = product_service.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product
