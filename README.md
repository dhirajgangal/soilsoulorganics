# Soil Soul shop

A small online shop for Soil Soul. The React website shows the products, and the FastAPI server saves orders in PostgreSQL.

The shop currently lists Soil Improvement Powder. The name, price, and short description live in `backend/app/db/seed.py`. The pack artwork leaves M.R.P. blank, so the selling price stays `0.00` until you set `SELLING_PRICE` in that file and run the seed command again.

## How a page load works

1. The browser opens the React app at `http://localhost:5173`.
2. React asks FastAPI for products: `GET http://localhost:8000/api/products`.
3. FastAPI calls a service function. That function uses SQLAlchemy to run a query.
4. PostgreSQL returns the product rows. FastAPI sends them back as JSON.
5. React draws a card for each product.

Adding a product to the cart does not call the API. The cart stays in the browser (`localStorage`) until checkout.

## How an order is saved

1. The checkout page checks the form, then sends `POST /api/orders`.
2. The request includes product ids and quantities. It does not include prices.
3. FastAPI validates the JSON with a Pydantic schema.
4. The order service loads those products from PostgreSQL and calculates the total from the stored prices.
5. It inserts one `orders` row and one `order_items` row per product.
6. The order status is `pending_payment`. This checkout does not take payment, so an order is never marked paid.
7. React shows the confirmation page with the JSON the API returned.

There is no public route to read an order later. An order contains a name, email, phone, and address, and the order number is easy to guess. The confirmation is kept in the browser tab instead.

## Project folders

```
backend/app/main.py            Starts FastAPI and connects the routes
backend/app/api/routes/        HTTP endpoints
backend/app/schemas/           Checks incoming JSON and shapes the response
backend/app/services/          Database reads and writes
backend/app/models/            SQLAlchemy tables
backend/app/db/                Connection, and the product seed script
backend/app/core/config.py     Reads DATABASE_URL and CORS_ORIGINS
backend/alembic/               Database migrations
frontend/src/pages/            One file for each screen
frontend/src/components/       Header, footer, buttons, and product cards
frontend/src/services/api.js   The fetch calls to FastAPI
frontend/src/assets/logo.png   The Soil Soul logo
```

## Run it locally

You need Python 3.11 or newer, Node.js, and PostgreSQL.

### 1. Start PostgreSQL

With Docker:

```bash
docker compose up -d
```

Or create the same database in PostgreSQL yourself:

```bash
psql -d postgres -c "CREATE USER soilsoul WITH PASSWORD 'soilsoul';"
psql -d postgres -c "CREATE DATABASE soilsoul OWNER soilsoul;"
psql -d soilsoul -c "GRANT ALL ON SCHEMA public TO soilsoul;"
```

The password in `.env.example` is for this local database only.

### 2. Start the API

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.db.seed
uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs` to try the routes in the browser.

### 3. Start the website

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## API routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check that the API process is running |
| GET | `/api/products` | List products |
| GET | `/api/products/{product_id}` | One product |
| POST | `/api/orders` | Save an order as pending payment. A logged-in customer is attached to the order. |
| POST | `/api/auth/register` | Create an account and return a login token |
| POST | `/api/auth/login` | Check email and password, return a login token |
| POST | `/api/auth/logout` | Forget the current login token |
| POST | `/api/auth/forgot-password` | Email a reset link when SMTP is configured |
| POST | `/api/auth/reset-password` | Set a new password from that link |
| GET | `/api/account/me` | The logged-in profile |
| GET | `/api/account/orders` | Orders placed while logged in |
| GET, POST, DELETE | `/api/account/addresses` | Saved delivery addresses |
| GET, POST, DELETE | `/api/account/wishlist` | Saved products |

## Database changes

The tables are described by the models in `backend/app/models/`. A migration file is the step that actually changes PostgreSQL.

- Apply the migrations you already have with `alembic upgrade head`.
- After you change a model, create the next migration from the `backend` folder:

```bash
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

Read the generated file before you apply it. Autogenerate is a draft, not a guarantee.

## Where to edit next

- Product text and prices: `backend/app/db/seed.py`
- Currency display: `frontend/src/services/money.js` (currently Indian rupees)
- Colors and spacing: `frontend/src/styles/`
- API address used by React: `frontend/.env`
- Database address used by FastAPI: `backend/.env`
