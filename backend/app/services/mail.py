"""Sends the forgot-password email.

If SMTP settings are empty, the reset link is written to the API log
so the shop can still be tested. The link is never returned in the API.
"""

import logging
import smtplib
from email.message import EmailMessage

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def send_password_reset(to_email: str, reset_url: str) -> None:
    settings = get_settings()
    if not settings.smtp_host:
        logger.warning("SMTP is not set. Password reset link for %s: %s", to_email, reset_url)
        return

    message = EmailMessage()
    message["Subject"] = "Reset your Soil Soul password"
    message["From"] = settings.smtp_from or settings.smtp_user
    message["To"] = to_email
    message.set_content(
        "Use this link to choose a new Soil Soul password. It expires in 30 minutes.\n\n"
        f"{reset_url}\n\n"
        "If you did not ask for this, you can ignore this email."
    )

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            server.starttls()
            if settings.smtp_user:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)
    except OSError:
        logger.exception("Could not send the password reset email to %s", to_email)
