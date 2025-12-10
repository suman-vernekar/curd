const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// File-based database path
const DB_FILE = path.join(__dirname, 'recipes.json');

// Initialize database file if it doesn't exist
async function initDB() {
    try {
        await fs.access(DB_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(DB_FILE, JSON.stringify([]));
    }
}

// Helper functions for file database operations
async function readRecipes() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading recipes:', error);
        return [];
    }
}

async function writeRecipes(recipes) {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(recipes, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing recipes:', error);
        return false;
    }
}

// Initialize database on startup
initDB();

// Routes
// Get all recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await readRecipes();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific recipe
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const recipes = await readRecipes();
        const recipe = recipes.find(r => r.id === req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new recipe
app.post('/api/recipes', async (req, res) => {
    try {
        const recipes = await readRecipes();
        const recipe = {
            id: uuidv4(),
            name: req.body.name,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            cookingTime: req.body.cookingTime
        };
        
        recipes.push(recipe);
        const success = await writeRecipes(recipes);
        
        if (success) {
            res.status(201).json(recipe);
        } else {
            res.status(500).json({ message: 'Failed to save recipe' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a recipe
app.put('/api/recipes/:id', async (req, res) => {
    try {
        const recipes = await readRecipes();
        const index = recipes.findIndex(r => r.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        recipes[index] = {
            id: req.params.id,
            name: req.body.name,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            cookingTime: req.body.cookingTime
        };
        
        const success = await writeRecipes(recipes);
        
        if (success) {
            res.json(recipes[index]);
        } else {
            res.status(500).json({ message: 'Failed to update recipe' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a recipe
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        const recipes = await readRecipes();
        const index = recipes.findIndex(r => r.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        recipes.splice(index, 1);
        const success = await writeRecipes(recipes);
        
        if (success) {
            res.json({ message: 'Recipe deleted successfully' });
        } else {
            res.status(500).json({ message: 'Failed to delete recipe' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to view the app`);
});