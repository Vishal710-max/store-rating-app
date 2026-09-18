# Store Rating App

A full-stack web application where users can discover stores and submit ratings (1–5), with role-based access for Admins, Normal Users, and Store Owners.

## Features

**Admin**
- Dashboard with total users, stores, and ratings submitted
- Add stores, normal users, and admin users
- View/search/filter/sort users and stores
- View user details (including a store owner's rating)

**Normal User**
- Register and log in
- Browse and search stores by name/address
- View overall rating and their own rating per store
- Submit and modify a rating (1–5)
- Change password

**Store Owner**
- Log in and view a dashboard scoped to their own store
- See average rating and the list of users who rated them
- Change password

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (raw parameterized queries via `pg`, no ORM)
- **Auth:** JWT + bcrypt password hashing

## User Roles

Roles are stored on the `users` table as an enum: `ADMIN`, `USER`, `STORE_OWNER`.
Self-service signup (`/auth/register`) always creates a `USER` account — admin and
store-owner accounts are created by an existing admin via `/admin/users`.

## Database Design

Three core tables: `users`, `stores`, `ratings`. See [`database/schema.sql`](database/schema.sql)
for the full definitions, indexes, and triggers. Key design points:

- `ratings` has a `UNIQUE (user_id, store_id)` constraint — a user can have exactly
  one rating per store, and "submit" vs "modify" both go through the same upsert.
- Field-length constraints (`name` 20–60 chars, `address` ≤400 chars, `rating` 1–5)
  are enforced both in the database (`CHECK` constraints) and in the API layer.

Run [`database/seed.sql`](database/seed.sql) after the schema to bootstrap one
admin account for first login.

## API Overview

| Method | Endpoint                     | Access               |
|--------|-------------------------------|-----------------------|
| POST   | `/auth/register`              | Public                |
| POST   | `/auth/login`                 | Public                |
| POST   | `/auth/change-password`       | Any authenticated user|
| GET    | `/admin/dashboard`             | Admin                 |
| POST   | `/admin/users`                 | Admin                 |
| GET    | `/admin/users`                 | Admin                 |
| GET    | `/admin/users/:id`              | Admin                 |
| POST   | `/admin/stores`                 | Admin                 |
| GET    | `/admin/stores`                 | Admin                 |
| GET    | `/stores`                       | Normal User           |
| POST   | `/stores/:storeId/rating`       | Normal User            |
| PUT    | `/stores/:storeId/rating`       | Normal User            |
| GET    | `/owner/dashboard`              | Store Owner            |

All role checks are enforced server-side (JWT middleware), never trusted from the client.
List endpoints (`/admin/users`, `/admin/stores`, `/stores`) support `search`, `sortBy`,
and `sortDir` query parameters.

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Database
```bash
createdb store_rating_db
psql -d store_rating_db -f database/schema.sql
psql -d store_rating_db -f database/seed.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # then fill in your DB credentials and a JWT secret
npm install
npm run dev             # starts on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev             # starts on http://localhost:5173
```

## Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL connection |
| `JWT_SECRET` | Secret used to sign auth tokens — use a long random string |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `FRONTEND_URL` | Allowed CORS origin |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |

## Test Credentials

After running `database/seed.sql`:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@storerating.local` | `Admin@12345` |

Change this password after first login. Create Normal User and Store Owner
accounts via signup / the Admin → Users panel respectively.

## How to Run (quick reference)

1. Start PostgreSQL and create the database.
2. Run `schema.sql` then `seed.sql`.
3. `npm run dev` in `backend/`.
4. `npm run dev` in `frontend/`.
5. Visit `http://localhost:5173`, log in as the seeded admin.

## Screenshots

_Add screenshots here once the UI is running against a live database._
