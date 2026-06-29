# Pixel Grid App

This project is a small full-stack pixel editor. The frontend displays a grid of colored cells, and the backend stores the grid data in a SQLite database so updates persist between refreshes.

## What it does

- Renders a visual pixel grid in React
- Lets you choose a brush color
- Clicks a cell to update its color through the backend API
- Persists pixel colors in the database

## Project structure

- Frontend: React app in the `src` folder
- Backend: Express server that serves the grid data and handles updates

## Run locally

### Backend

From the backend folder:

```bash
npm start
```

### Frontend

From the frontend folder:

```bash
npm start
```

The frontend expects the backend to be running on `http://localhost:3000`.

## Notes

- The backend endpoint for fetching data is `GET /grid`
- The backend endpoint for updating a pixel is `POST /grid/update`
