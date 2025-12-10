// API base URL
const API_BASE_URL = '/api/recipes';

let editingRecipeId = null;

// DOM Elements
const recipeForm = document.getElementById('recipeForm');
const recipeList = document.getElementById('recipeList');
const searchInput = document.getElementById('searchInput');

// Load recipes when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
    
    // Set up form submission
    recipeForm.addEventListener('submit', handleFormSubmit);
    
    // Set up cancel button
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    
    // Set up search
    searchInput.addEventListener('input', loadRecipes);
});

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const recipeName = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;
    const cookingTime = document.getElementById('cookingTime').value;
    
    const recipeData = {
        name: recipeName,
        ingredients: ingredients,
        instructions: instructions,
        cookingTime: parseInt(cookingTime)
    };
    
    // Get the ID from the hidden field
    const recipeId = document.getElementById('recipeId').value;
    
    if (recipeId) {
        // Update existing recipe
        await updateRecipe(recipeId, recipeData);
    } else {
        // Add new recipe
        await addRecipe(recipeData);
    }
    
    resetForm();
}

// Add a new recipe
async function addRecipe(recipeData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });
        
        if (response.ok) {
            loadRecipes();
        } else {
            throw new Error('Failed to add recipe');
        }
    } catch (error) {
        console.error('Error adding recipe:', error);
        alert('Failed to add recipe. Please try again.');
    }
}

// Update an existing recipe
async function updateRecipe(id, recipeData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });
        
        if (response.ok) {
            loadRecipes();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update recipe');
        }
    } catch (error) {
        console.error('Error updating recipe:', error);
        alert('Failed to update recipe. Please try again.');
    }
}

// Delete a recipe
async function deleteRecipe(id) {
    if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadRecipes();
        } else {
            throw new Error('Failed to delete recipe');
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe. Please try again.');
    }
}

// Edit a recipe
async function editRecipe(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipe');
        }
        
        const recipe = await response.json();
        
        document.getElementById('recipeId').value = recipe.id || recipe._id;
        document.getElementById('recipeName').value = recipe.name;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('cookingTime').value = recipe.cookingTime;
        
        editingRecipeId = recipe.id || recipe._id;
        document.getElementById('saveBtn').textContent = 'Update Recipe';
    } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('Failed to load recipe for editing. Please try again.');
    }
}

// Reset form
function resetForm() {
    recipeForm.reset();
    document.getElementById('recipeId').value = '';
    editingRecipeId = null;
    document.getElementById('saveBtn').textContent = 'Save Recipe';
}

// Load and display recipes
async function loadRecipes() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
        recipeList.innerHTML = '<div class="no-recipes">Error loading recipes. Please try again.</div>';
    }
}

// Display recipes in the UI
function displayRecipes(recipes) {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.toLowerCase().includes(searchTerm)
    );
    
    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = '<div class="no-recipes">No recipes found. Try a different search term.</div>';
        return;
    }
    
    recipeList.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card">
            <h3>${recipe.name}</h3>
            <div class="cooking-time">${recipe.cookingTime} mins</div>
            <div class="ingredients">
                <strong>Ingredients:</strong>
                <p>${recipe.ingredients}</p>
            </div>
            <div class="instructions">
                <strong>Instructions:</strong>
                <p>${recipe.instructions}</p>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editRecipe('${recipe.id || recipe._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteRecipe('${recipe.id || recipe._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// The frontend now communicates with the backend API instead of simulating MongoDB connection
// All CRUD operations are handled through REST API calls to the Node.js server