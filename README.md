# Recipe Management System

A full-stack CRUD application for managing recipes with MongoDB, Express.js, and vanilla JavaScript.

## Features

- Create, Read, Update, and Delete recipes
- Search functionality
- Responsive design
- MongoDB integration for persistent storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance)
- npm (comes with Node.js)

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Database Setup

1. Make sure MongoDB is running on your system
2. The application will automatically connect to MongoDB at `mongodb://localhost:27017/recipeDB`
3. If you want to use a different MongoDB connection string, update it in `server.js`

## Running the Application

1. Start the server:
   ```
   npm start
   ```
   or for development with auto-restart:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # Styling for the application
├── app.js              # Frontend JavaScript logic
├── server.js           # Backend server with Express and MongoDB
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## API Endpoints

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get a specific recipe
- `POST /api/recipes` - Create a new recipe
- `PUT /api/recipes/:id` - Update a recipe
- `DELETE /api/recipes/:id` - Delete a recipe

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Other**: CORS for cross-origin requests

## License

This project is open source and available under the MIT License.
