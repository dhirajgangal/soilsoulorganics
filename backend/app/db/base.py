"""Shared base class for SQLAlchemy models.

Every model inherits from Base so Alembic can see all tables together.
"""

from sqlalchemy.orm import declarative_base

Base = declarative_base()
