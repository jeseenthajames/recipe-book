import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/recipes";

function App() {
  const [js_recipes, js_setRecipes] = useState([]);
  const [js_isLoading, js_setIsLoading] = useState(true);
  const [js_form, js_setForm] = useState({
    name: "",
    category: "Breakfast",
    ingredients: "",
    steps: "",
    cookingTime: ""
  });
  const [js_editId, js_setEditId] = useState(null);
  const [js_message, js_setMessage] = useState({ text: "", type: "" });
  const [js_selectedRecipe, js_setSelectedRecipe] = useState(null);

  // Fetch all recipes from MongoDB on initial mount
  const fetchRecipes = async () => {
    try {
      js_setIsLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Failed to load recipes (status ${res.status})`);
      }
      const data = await res.json();
      js_setRecipes(data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      js_setMessage({
        text: "Could not load recipes from database. Please verify backend is running.",
        type: "error"
      });
    } finally {
      js_setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  function js_handleChange(event) {
    const { name, value } = event.target;

    js_setForm({
      ...js_form,
      [name]: value
    });
  }

  async function js_handleSubmit(event) {
    event.preventDefault();

    if (
      !js_form.name.trim() ||
      !js_form.ingredients.trim() ||
      !js_form.steps.trim() ||
      js_form.cookingTime === "" ||
      Number(js_form.cookingTime) <= 0
    ) {
      js_setMessage({
        text: "Please enter valid values in all required fields.",
        type: "error"
      });
      return;
    }

    const payload = {
      name: js_form.name.trim(),
      category: js_form.category,
      ingredients: js_form.ingredients.trim(),
      steps: js_form.steps.trim(),
      cookingTime: Number(js_form.cookingTime)
    };

    try {
      if (js_editId !== null) {
        // UPDATE existing recipe in MongoDB
        const res = await fetch(`${API_URL}/${js_editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to update recipe.");
        }

        const updatedRecipe = await res.json();
        js_setRecipes(
          js_recipes.map((r) =>
            (r._id || r.id) === js_editId ? updatedRecipe : r
          )
        );
        js_setMessage({ text: "Recipe updated successfully!", type: "success" });
      } else {
        // CREATE new recipe in MongoDB
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to add recipe.");
        }

        const newRecipe = await res.json();
        js_setRecipes([newRecipe, ...js_recipes]);
        js_setMessage({ text: "Recipe added successfully!", type: "success" });
      }

      // Reset form
      js_setForm({
        name: "",
        category: "Breakfast",
        ingredients: "",
        steps: "",
        cookingTime: ""
      });
      js_setEditId(null);
    } catch (err) {
      console.error("Error saving recipe:", err);
      js_setMessage({
        text: err.message || "Failed to save recipe. Please check your backend connection.",
        type: "error"
      });
    }
  }

  function js_handleEdit(js_recipe) {
    js_setForm({
      name: js_recipe.name,
      category: js_recipe.category,
      ingredients: js_recipe.ingredients,
      steps: js_recipe.steps,
      cookingTime: js_recipe.cookingTime
    });

    js_setEditId(js_recipe._id || js_recipe.id);
    js_setMessage({ text: "", type: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function js_handleDelete(js_id) {
    const js_confirm = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!js_confirm) return;

    try {
      const res = await fetch(`${API_URL}/${js_id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete recipe.");
      }

      js_setRecipes(
        js_recipes.filter((js_recipe) => (js_recipe._id || js_recipe.id) !== js_id)
      );

      js_setMessage({ text: "Recipe deleted successfully!", type: "success" });
    } catch (err) {
      console.error("Error deleting recipe:", err);
      js_setMessage({
        text: err.message || "Failed to delete recipe from server.",
        type: "error"
      });
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">🍲</span>
          <span>Recipe<span className="brand-accent">Book</span></span>
        </div>

        <p className="header-caption">Your kitchen, your collection.</p>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">YOUR PERSONAL COOKBOOK</p>
            <h1>Every recipe has a story.</h1>
            <p className="hero-description">
              Keep your favourite flavours, ingredients and cooking
              instructions together in one beautiful place.
            </p>
          </div>

          <div className="hero-icon">🥗</div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECIPE COLLECTION</p>
              <h2>{js_editId !== null ? "Edit Recipe" : "Add a Recipe"}</h2>
            </div>
          </div>

          {js_message.text && (
            <div
              className={`message ${js_message.type === "error" ? "error" : ""}`}
              role="status"
            >
              {js_message.text}
            </div>
          )}

          <form onSubmit={js_handleSubmit} className="recipe-form">
            <div className="form-group">
              <label htmlFor="name">Recipe Name *</label>
              <input
                id="name"
                name="name"
                value={js_form.name}
                onChange={js_handleChange}
                placeholder="e.g. Homemade Pasta"
                maxLength="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={js_form.category}
                onChange={js_handleChange}
                required
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
                <option>Dessert</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cookingTime">Cooking Time (minutes) *</label>
              <input
                id="cookingTime"
                name="cookingTime"
                type="number"
                min="1"
                step="1"
                value={js_form.cookingTime}
                onChange={js_handleChange}
                placeholder="e.g. 30"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="ingredients">Ingredients *</label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={js_form.ingredients}
                onChange={js_handleChange}
                placeholder="Enter ingredients, separated by commas or on separate lines..."
                rows="3"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="steps">Preparation Steps *</label>
              <textarea
                id="steps"
                name="steps"
                value={js_form.steps}
                onChange={js_handleChange}
                placeholder="Describe how to prepare your recipe..."
                rows="4"
                required
              />
            </div>

            <div className="form-actions full-width">
              <button type="submit" className="primary-button">
                {js_editId !== null ? "Save Changes" : "+ Add Recipe"}
              </button>

              {js_editId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    js_setEditId(null);
                    js_setForm({
                      name: "",
                      category: "Breakfast",
                      ingredients: "",
                      steps: "",
                      cookingTime: ""
                    });
                    js_setMessage({ text: "", type: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="collection-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MADE WITH LOVE</p>
              <h2>Your Recipes</h2>
            </div>

            <span className="recipe-count">
              {js_recipes.length} {js_recipes.length === 1 ? "recipe" : "recipes"}
            </span>
          </div>

          {js_isLoading ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>Loading recipes...</h3>
              <p>Fetching your collection from the database.</p>
            </div>
          ) : js_recipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <h3>Your cookbook is waiting!</h3>
              <p>Add your first recipe using the form above.</p>
            </div>
          ) : (
            <div className="recipe-grid">
              {js_recipes.map((js_recipe) => {
                const recipeId = js_recipe._id || js_recipe.id;
                return (
                  <article className="recipe-card" key={recipeId}>
                    <div className="card-top">
                      <span className="category-badge">
                        {js_recipe.category}
                      </span>
                      <span className="food-icon">🍽️</span>
                    </div>

                    <h3>{js_recipe.name}</h3>

                    <p className="cooking-time">
                      ◷ {js_recipe.cookingTime} minutes
                    </p>

                    <button
                      type="button"
                      className="view-details-button"
                      onClick={() => js_setSelectedRecipe(js_recipe)}
                    >
                      View Details
                    </button>

                    <div className="card-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => js_handleEdit(js_recipe)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => js_handleDelete(recipeId)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Made for food lovers, one recipe at a time. ♡</p>
      </footer>

      {/* Recipe Details Modal */}
      {js_selectedRecipe && (
        <div
          className="modal-overlay"
          onClick={() => js_setSelectedRecipe(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <div className="modal-badge-group">
                <span className="category-badge">
                  {js_selectedRecipe.category}
                </span>
                <span className="cooking-time-badge">
                  ◷ {js_selectedRecipe.cookingTime} minutes
                </span>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => js_setSelectedRecipe(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <h2 id="modal-title" className="modal-title">
              {js_selectedRecipe.name}
            </h2>

            <div className="modal-body">
              <section className="modal-section">
                <h3>Ingredients</h3>
                <p className="modal-text">{js_selectedRecipe.ingredients}</p>
              </section>

              <section className="modal-section">
                <h3>Preparation Steps</h3>
                <p className="modal-text">{js_selectedRecipe.steps}</p>
              </section>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => js_setSelectedRecipe(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
