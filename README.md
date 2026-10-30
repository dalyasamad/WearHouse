# WearHouse

WearHouse is a full-stack digital wardrobe management application developed for **CSIS 279 – Advances in Computer Science** at the University of Balamand.

The application allows users to organize their clothing, create outfits, schedule outfits on a calendar, track outfits they have worn, and manage their personal wardrobe through a clean and responsive interface.

## Main Features

### User Authentication
- User registration
- User login
- JWT-based authentication
- Protected application routes
- Automatic redirect to login when a session expires
- Logout
- Profile editing
- Account deletion

### Digital Wardrobe
- Add clothing items
- Upload clothing images
- View clothing details
- Edit clothing information
- Replace or remove clothing images
- Delete clothing items
- Mark clothing items as favorites
- Search clothing by name, category, or color
- Filter clothing by:
  - Category
  - Season
  - Favorites

### Outfit Management
- Create outfits using wardrobe items
- Select multiple clothing items for an outfit
- Edit existing outfits
- Delete outfits
- Add notes to outfits
- Mark outfits as favorites
- Mark outfits as worn
- Automatically remove deleted clothing items from existing outfits
- Automatically remove outfits that become empty after clothing deletion

### Outfit Calendar
- Schedule saved outfits for specific dates
- Navigate between months
- View scheduled outfits directly on calendar days
- Update an existing scheduled outfit
- Remove scheduled outfits
- Store calendar dates without timezone-related date shifting

### Wear History
- Mark outfits as worn
- Store wear history in PostgreSQL
- Display recently worn outfits on the Dashboard
- Display the correct worn date without timezone conversion issues

### Dashboard
The Dashboard displays real data for the logged-in user, including:

- Total clothing items
- Favorite clothing items
- Saved outfits
- Planned looks
- Favorite clothing
- Recently worn outfits
- Recent outfits
- Upcoming scheduled outfits

## Technologies Used

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

### Development Tools
- npm
- Git
- PostgreSQL
- pgAdmin
- Visual Studio Code 

## Project Structure

```text
wearhouse/
│
├── app/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── views/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
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
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── .env.example
│   └── package.json
│── database/
│   └── schema.sql
└── README.md
```

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
Routes define the API endpoints and connect incoming requests to the appropriate controllers.

### Controllers
Controllers receive HTTP requests and responses and communicate with the service layer.

### Services
Services contain the application's business logic and validation.

### Repositories
Repositories communicate directly with PostgreSQL and execute SQL queries.

This separation keeps the backend organized and makes the application easier to maintain and extend.

## Database

WearHouse uses PostgreSQL.

The main database tables are:

### `users`
Stores registered user information.

Important fields include:
- `user_id`
- `first_name`
- `last_name`
- `email`
- `password_hash`
- `profile_picture`
- `created_at`

### `categories`
Stores clothing categories.

Examples:
- Tops
- Shirts
- Jeans
- Trousers
- Shorts
- Skirts
- Dresses
- Jackets
- Shoes
- Bags

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
Stores saved outfits.

Important fields include:
- `outfit_id`
- `user_id`
- `name`
- `notes`
- `is_favorite`

### `outfit_items`
Junction table connecting clothing items with outfits.

This allows one outfit to contain multiple clothing items.

### `outfit_schedule`
Stores outfits assigned to specific calendar dates.

### `wear_history`
Stores records of outfits that users have marked as worn.

## API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
```

### User

```text
GET    /users/me
PUT    /users/me
DELETE /users/me
```

### Clothing

```text
GET    /clothing
POST   /clothing
GET    /clothing/:id
PUT    /clothing/:id
DELETE /clothing/:id
POST   /clothing/upload
```

### Outfits

```text
GET    /outfits
POST   /outfits
GET    /outfits/:id
PUT    /outfits/:id
DELETE /outfits/:id

POST   /outfits/:id/favorite
POST   /outfits/:id/wear
```

### Outfit Schedule

```text
GET    /schedules
POST   /schedules
PUT    /schedules/:id
DELETE /schedules/:id
```

### Wear History

```text
GET /wear-history
```

## Custom React Hooks

WearHouse includes reusable custom React hooks.

### `useForm`

The `useForm` hook centralizes common form behavior such as:

- Form values
- Input changes
- Checkbox changes
- Validation
- Setting individual field values
- Form reset

It is used across forms such as:

- Login
- Registration
- Profile
- Add Clothing
- Edit Clothing

This avoids repeating the same form-state logic in multiple components.

### `useAuth`

The `useAuth` hook handles client-side authentication state.

It manages:

- The logged-in user
- JWT token
- Authentication status
- Saving a login session
- Updating stored user information
- Logout

It is used by components including:

- Login
- Dashboard
- Profile
- ProtectedRoute

## Centralized API Handling

Protected API requests use a reusable `apiFetch` helper.

The helper:

- Automatically attaches the user's JWT token
- Detects `401 Unauthorized` responses
- Removes an invalid or expired session
- Redirects the user to the login page

This avoids repeating authentication logic in every API service.

## Image Uploads

Clothing images are uploaded using **Multer**.

Uploaded files are stored in:

```text
api/uploads/
```

The backend exposes this directory through:

```text
/uploads
```

Supported image formats include:

- JPG / JPEG
- PNG
- WEBP

The maximum upload size is 5 MB.

## Authentication and Security

Passwords are not stored directly in the database.

WearHouse uses:

- `bcryptjs` for password hashing
- JSON Web Tokens for authenticated requests
- Protected backend routes
- User-specific database queries using `user_id`

Each user can only access their own clothing, outfits, schedules, and wear history.

## Running the Project

### Requirements

Before running WearHouse, install:

- Node.js
- npm
- PostgreSQL

## Backend Setup

Open a terminal and navigate to the backend:

```bash
cd api
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `api` directory.

Configure the PostgreSQL connection and JWT secret according to the database configuration used by the project.

Example:

```env.example
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wearhouse
DB_USER=postgres
DB_PASSWORD=your_database_password
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:3000
```

### Database Setup

Create a PostgreSQL database named:

```text
wearhouse



## Frontend Setup

Open a second terminal.

Navigate to the frontend:

```bash
cd app
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Open the URL shown by Vite in the terminal.

Usually:

```text
http://localhost:5173
```

## Typical Application Flow

A normal WearHouse workflow is:

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

All wardrobe, outfit, scheduling, and wear-history data is stored in PostgreSQL and associated with the authenticated user.

## Important Application Behavior

### Clothing Deletion

If a clothing item belongs to an outfit and the clothing item is deleted:

- The clothing item is removed from the outfit.
- The remaining outfit is preserved if it still contains clothing.
- If the deleted clothing item was the final item in an outfit, the empty outfit is automatically deleted.

### Scheduling

Only one outfit is stored for a given scheduled date.

Selecting a different outfit for a date updates the existing calendar entry.

### Dates

Calendar dates and wear-history dates are handled as date-only values to avoid JavaScript timezone conversions causing them to appear on the previous day.

## Features Outside the Project Scope

WearHouse intentionally does not include:

- AI-generated outfit recommendations
- Automatic clothing recognition
- Social-media functionality
- Online shopping
- Payments

These were outside the intended scope of the application.

## Future Improvements

Possible future extensions include:

- User profile-picture uploads
- Weather-based outfit suggestions
- Clothing usage statistics
- Outfit recommendation algorithms
- Additional wardrobe sorting options
- Automatic cleanup of unused uploaded image files
- More detailed wear-history analytics

## Course

**CSIS 279 – Advances in Computer Science**  
University of Balamand

## Project

**WearHouse – Digital Wardrobe Management Application**