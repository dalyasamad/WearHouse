# WearHouse Frontend

This folder contains the React frontend for WearHouse.

WearHouse is a digital wardrobe and outfit-planning application that allows users to manage clothing items, create outfits, schedule outfits, record wear history, and manage their profile.

## Technologies

- React
- Vite
- React Router
- JavaScript
- CSS
- ESLint

## Setup

Install dependencies:

```bash
npm install
```

Create:

```text
.env.local
```

using `.env.example` as the template.

Example:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The development server normally runs at:

```text
http://localhost:5173
```

## Linting

Run:

```bash
npm run lint
```

The project should complete with no ESLint errors or warnings.

## Frontend Structure

```text
src/
├── components/
├── config/
├── data/
├── hooks/
├── services/
├── views/
├── App.jsx
├── main.jsx
└── index.css
```

### Components

Reusable interface elements used across the application.

### Views

Pages such as the dashboard, wardrobe, outfit creator, calendar, profile, login, and registration.

### Services

Functions responsible for communication with the Express backend.

### Hooks

Reusable React logic including authentication and form management.

### Config

Contains frontend configuration such as the API base URL and asset URL handling.

## API Configuration

The frontend uses:

```env
VITE_API_URL
```

to determine the backend location.

API addresses are not hardcoded inside individual service files.