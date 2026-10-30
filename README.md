# WearHouse

WearHouse is a full-stack digital wardrobe and outfit-planning web application developed for CSIS 279 – Advances in Computer Science at the University of Balamand.

The application allows users to organize clothing digitally, create and save outfits, schedule outfits on a calendar, record outfits as worn, and manage their personal wardrobe.

## Main Features

### Authentication and Account Management

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected frontend and backend routes
- Profile editing
- Logout
- Account deletion
- User-specific data isolation

### Digital Wardrobe

- Add clothing items
- Upload clothing images
- View clothing details
- Edit clothing information
- Replace or remove clothing images
- Delete clothing items
- Mark clothing as favorite
- Search clothing
- Filter by category, season, and favorites
- Store color, size, season, and notes

### Outfit Management

- Create outfits from wardrobe items
- Select multiple clothing items
- Edit saved outfits
- Delete outfits
- Add outfit notes
- Favorite outfits
- Mark outfits as worn
- Prevent duplicate clothing items in an outfit

### Outfit Calendar

- Schedule outfits for specific dates
- Navigate between calendar months
- View scheduled outfits
- Change an existing scheduled outfit
- Remove scheduled outfits
- Validate calendar dates before database operations

### Wear History

- Record outfits as worn
- Store wear history in PostgreSQL
- Display recently worn outfits
- Preserve date-only values without timezone shifting

### Dashboard

The dashboard displays information for the authenticated user, including:

- Total clothing items
- Favorite clothing
- Saved outfits
- Planned outfits
- Recently worn outfits
- Recent saved outfits
- Upcoming scheduled outfits

---

## Technologies

### Frontend

- React
- Vite
- React Router
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens
- bcryptjs
- Multer
- Helmet
- express-rate-limit

### Testing and Development

- Jest
- ESLint
- npm
- Git
- pgAdmin / PostgreSQL

---

## Project Structure

```text
WearHouse/
│
├── app/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── views/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   └── package.json
│
├── api/                         # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── authValidator.test.js
│   │   ├── outfitValidator.test.js
│   │   └── scheduleValidator.test.js
│   │
│   ├── uploads/
│   ├── .env.example
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── .gitignore
└── README.md
```

---

## Application Architecture

WearHouse uses a layered backend architecture.

```text
React Frontend
      ↓
HTTP Requests
      ↓
Express Routes
      ↓
Controllers
      ↓
Services
      ↓
Repositories
      ↓
PostgreSQL
```

### Routes

Routes define API paths and connect HTTP requests to controllers.

### Controllers

Controllers receive requests, call the appropriate services, and return HTTP responses.

### Services

Services contain application business logic, ownership checks, and processing rules.

### Repositories

Repositories contain parameterized PostgreSQL queries and database operations.

### Validators

Validators check request data before it reaches the database.

### Middleware

Middleware handles functionality such as authentication and image uploads.

This separation keeps database logic, business logic, HTTP handling, and validation independent from each other.

---

## Database

WearHouse uses PostgreSQL and contains seven main tables.

### `users`

Stores registered account information.

Important fields:

- `user_id`
- `first_name`
- `last_name`
- `email`
- `password_hash`
- `profile_picture`
- `created_at`

### `categories`

Stores clothing categories.

### `clothing_items`

Stores clothing belonging to users.

Important fields include:

- `item_id`
- `user_id`
- `category_id`
- `name`
- `image_url`
- `color`
- `size`
- `season`
- `is_favorite`
- `notes`

### `outfits`

Stores outfits created by users.

### `outfit_items`

Junction table connecting outfits and clothing items.

The combination of `outfit_id` and `item_id` forms the composite primary key.

### `outfit_schedule`

Stores outfits assigned to calendar dates.

### `wear_history`

Stores records of outfits marked as worn.

---

# Running WearHouse Locally

## Requirements

Before starting, install:

- Node.js
- npm
- PostgreSQL
- Git

pgAdmin is optional but useful for managing PostgreSQL visually.

---

## 1. Clone the Repository

```bash
git clone https://github.com/dalyasamad/WearHouse.git
cd WearHouse
```

---

## 2. Create the PostgreSQL Database

Create a PostgreSQL database named:

```text
wearhouse
```

Using PostgreSQL:

```sql
CREATE DATABASE wearhouse;
```

Then connect to the `wearhouse` database and execute:

```text
database/schema.sql
```

### Using pgAdmin

1. Create a database named `wearhouse`.
2. Open the Query Tool for the new database.
3. Open `database/schema.sql`.
4. Execute the complete SQL file.

### Using `psql`

From the project root:

```bash
psql -U postgres -d wearhouse -f database/schema.sql
```

---

## 3. Configure the Backend

Navigate to:

```bash
cd api
```

Install dependencies:

```bash
npm install
```

Copy the example environment configuration:

```text
api/.env.example
```

and create:

```text
api/.env
```

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=wearhouse
DB_USER=postgres
DB_PASSWORD=your_database_password

JWT_SECRET=replace_with_a_long_random_secret

CLIENT_ORIGIN=http://localhost:5173
```

The real `.env` file must not be committed to Git.

Start the backend:

```bash
npm run dev
```

The backend runs locally at:

```text
http://localhost:3000
```

---

## 4. Configure the Frontend

Open another terminal and navigate to:

```bash
cd app
```

Install dependencies:

```bash
npm install
```

Create:

```text
app/.env.local
```

using `app/.env.example` as the template.

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Vite normally runs the frontend at:

```text
http://localhost:5173
```

---

# API Endpoints

Protected endpoints require a valid JWT in the request.

## Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Registration Example

Request:

```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "password": "WearHouse1!"
}
```

---

## User

```text
GET    /users/me
PUT    /users/me
DELETE /users/me
```

---

## Clothing

```text
GET    /clothing
POST   /clothing
GET    /clothing/:id
PUT    /clothing/:id
DELETE /clothing/:id

POST   /clothing/upload
```

Uploaded image paths are stored as relative `/uploads/...` paths so the application is not tied to a specific backend hostname.

---

## Outfits

```text
GET    /outfits
POST   /outfits
GET    /outfits/:id
PUT    /outfits/:id
DELETE /outfits/:id

POST   /outfits/:id/favorite
POST   /outfits/:id/wear
```

### Create Outfit Example

Request:

```json
{
  "name": "University Outfit",
  "notes": "Simple everyday outfit",
  "is_favorite": false,
  "item_ids": [1, 2, 3]
}
```

Duplicate clothing IDs are rejected during validation.

---

## Outfit Schedule

```text
GET    /schedules
POST   /schedules
PUT    /schedules/:id
DELETE /schedules/:id
```

### Schedule Example

```json
{
  "outfit_id": 5,
  "scheduled_date": "2026-11-15"
}
```

Dates must use valid `YYYY-MM-DD` format. Invalid or impossible calendar dates are rejected before PostgreSQL is called.

---

## Wear History

```text
GET /wear-history
```

Wear-history records are also created when a saved outfit is marked as worn.

---

# Validation

WearHouse validates user input before database operations.

Validation includes:

- Required registration fields
- Email format
- Password strength
- Required clothing information
- Valid clothing IDs
- Required outfit names
- At least one item per outfit
- Duplicate outfit item detection
- Valid schedule outfit IDs
- Valid `YYYY-MM-DD` dates
- Impossible calendar dates

Password requirements for new accounts include:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

# Testing

WearHouse includes automated backend validation tests using Jest.

The current test suite contains **23 tests across 3 test suites**.

Tests cover:

- Registration validation
- Login validation
- Invalid email addresses
- Password-strength requirements
- Valid outfit creation
- Missing outfit names
- Empty outfits
- Duplicate clothing IDs
- Invalid clothing IDs
- Schedule validation
- Date formatting
- Impossible calendar dates
- Leap-year handling
- Invalid outfit IDs

## Run the Tests

Navigate to the backend:

```bash
cd api
```

Then run:

```bash
npm test
```

A successful test run should report:

```text
Test Suites: 3 passed, 3 total
Tests:       23 passed, 23 total
```

The current validation tests do not require a PostgreSQL connection and do not modify application data.

---

# Linting

The React frontend uses ESLint.

Run:

```bash
cd app
npm run lint
```

The project should complete linting with no errors or warnings.

---

# Security

WearHouse includes several security measures.

### Password Security

Passwords are hashed using `bcryptjs` before being stored.

### Authentication

Protected backend routes require a valid JSON Web Token.

### Authorization

Repository and service operations use the authenticated user's ID so users cannot access another user's wardrobe, outfits, schedules, or wear history.

### CORS

The backend limits browser requests to the configured frontend origin using `CLIENT_ORIGIN`.

### Security Headers

Helmet adds standard HTTP security headers.

### Rate Limiting

API requests are rate limited, with stricter limits applied to authentication routes.

### Image Uploads

Image uploads:

- Accept JPG/JPEG, PNG, and WEBP files
- Have a 5 MB size limit
- Use generated filenames
- Determine the saved extension from the accepted MIME type

When a clothing image is replaced or removed, the old uploaded file is deleted.

When a clothing item is deleted, its uploaded image is also deleted.

When a user account is deleted, the user's uploaded clothing images are cleaned from the uploads directory.

---

# Environment and Repository Safety

The following files must not be committed:

```text
.env
.env.local
node_modules/
api/uploads/*
```

Example environment files are included instead:

```text
api/.env.example
app/.env.example
```

No database passwords or JWT secrets should be stored in the repository.

---

# Image Upload Storage

During local development, clothing images are stored in:

```text
api/uploads/
```

This folder contains runtime user-generated data and is intentionally excluded from version control.

A `.gitkeep` file may be used so the empty directory exists after cloning.

---

# Typical Application Flow

```text
Register
   ↓
Login
   ↓
Add Clothing
   ↓
Organize Wardrobe
   ↓
Create Outfit
   ↓
Save Outfit
   ↓
Schedule Outfit
   ↓
Mark Outfit as Worn
   ↓
View Dashboard
```

All personal wardrobe data is associated with the authenticated user.

---

# Important Application Behavior

## Clothing Deletion

If a clothing item is used in an outfit and is deleted:

- The clothing item is removed from the outfit.
- The outfit remains if other clothing items are still part of it.
- An outfit that becomes empty can be removed automatically.

## Scheduling

Saved outfits can be assigned to calendar dates and later changed or removed.

## Dates

Schedule and wear-history dates are treated as date-only values to avoid JavaScript timezone conversion problems.

---

# Custom React Hooks

## `useForm`

The reusable `useForm` hook centralizes common form behavior such as:

- Form values
- Input changes
- Checkbox changes
- Validation
- Resetting forms
- Updating values programmatically

It is used across several WearHouse forms.

## `useAuth`

The `useAuth` hook handles frontend authentication state including:

- Logged-in user
- JWT token
- Login state
- Updating the stored user
- Logout

---

# Centralized API Handling

Protected frontend requests use the reusable `apiFetch` helper.

It:

- Attaches the JWT token automatically
- Detects `401 Unauthorized`
- Clears invalid or expired sessions
- Redirects unauthenticated users to login

The frontend API base URL is configured using `VITE_API_URL` instead of being hardcoded into individual services.

---

# Course

**CSIS 279 – Advances in Computer Science**  
University of Balamand

## Project

**WearHouse – Digital Wardrobe and Outfit Planning Web Application**