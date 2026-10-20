"""Soil Soul API entry point.

Start it from the backend folder:

    uvicorn app.main:app --reload

Then open http://localhost:8000/docs to try the routes.
"""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError

from app.api.routes import orders, products
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title="Soil Soul API", version="0.1.0")

# The React app runs on another port, so the browser asks permission
# before it can call this API. CORSMiddleware grants that permission
# to the addresses in CORS_ORIGINS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")


@app.get("/api/health")
def health() -> dict[str, str]:
    """Lets you check that the API process is running."""
    return {"status": "ok"}


@app.exception_handler(RequestValidationError)
async def invalid_request(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Turn Pydantic's error list into one readable sentence."""
    messages = []
    for error in exc.errors():
        message = error.get("msg", "Check the submitted information.")
        prefix = "Value error, "
        if message.startswith(prefix):
            message = message[len(prefix) :]
        messages.append(message)
    return JSONResponse(status_code=422, content={"detail": " ".join(messages)})


@app.exception_handler(OperationalError)
async def database_unavailable(request: Request, exc: OperationalError) -> JSONResponse:
    """Turn a refused database connection into a clear API error."""
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Could not reach PostgreSQL. Start the database and check DATABASE_URL."
        },
    )
