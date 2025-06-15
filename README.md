# Full Stack Open Course Project

This project is part of the Full Stack Open course and consists of two main parts:

1. **Backend**: A Node.js server with GraphQL API.
2. **Frontend**: A React-based library application.

## Project Structure

```
backend/
  index.js
  package.json
  resolver.js
  schema.js
  src/
    models/
      authorSchema.js
      bookSchema.js
      userSchema.js
library-frontend/
  index.html
  package.json
  README.md
  vite.config.js
  public/
    vite.svg
  src/
    App.jsx
    main.jsx
    queries.js
    components/
      Authors.jsx
      Books.jsx
      LoginForm.jsx
      NewBook.jsx
      Recommendation.jsx
```

## Backend

The backend is a Node.js application that provides a GraphQL API for managing authors, books, and users.

### Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:4000` by default.

## Frontend

The frontend is a React application built with Vite. It provides a user interface for interacting with the library system.

### Setup

1. Navigate to the `library-frontend` directory:
   ```bash
   cd library-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The application will run on `http://localhost:5173` by default.

## Features

- **Backend**:
  - GraphQL API for managing authors, books, and users.
  - MongoDB integration for data persistence.

- **Frontend**:
  - User authentication.
  - View and manage authors and books.
  - Personalized book recommendations.

*Completed by: Estivenm06*
