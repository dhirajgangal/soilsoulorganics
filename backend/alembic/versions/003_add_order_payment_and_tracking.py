"""Add payment method, payment status, and last update time to orders.

Old orders saved as "pending_payment" become "placed" with a pending
cash on delivery payment.

Revision ID: 003_order_tracking
Revises: 002_accounts
Create Date: 2026-10-28
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003_order_tracking"
down_revision: Union[str, Sequence[str], None] = "002_accounts"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "orders",
        sa.Column("payment_method", sa.String(length=20), nullable=False, server_default="cod"),
    )
    op.add_column(
        "orders",
        sa.Column("payment_status", sa.String(length=20), nullable=False, server_default="pending"),
    )
    op.add_column(
        "orders",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.execute("UPDATE orders SET status = 'placed' WHERE status = 'pending_payment'")
    op.execute("UPDATE orders SET updated_at = created_at")


def downgrade() -> None:
    op.execute("UPDATE orders SET status = 'pending_payment' WHERE status = 'placed'")
    op.drop_column("orders", "updated_at")
    op.drop_column("orders", "payment_status")
    op.drop_column("orders", "payment_method")
