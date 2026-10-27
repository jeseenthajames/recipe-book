
import { useState } from "react";
import "./App.css";

function App() {
  const [js_recipes, js_setRecipes] = useState([]);
  const [js_form, js_setForm] = useState({
    name: "",
    category: "Breakfast",
    ingredients: "",
    steps: "",
    cookingTime: ""
  });
  const [js_editId, js_setEditId] = useState(null);
  const [js_message, js_setMessage] = useState("");

  function js_handleChange(event) {
    const { name, value } = event.target;

    js_setForm({
      ...js_form,
      [name]: value
    });
  }

  function js_handleSubmit(event) {
    event.preventDefault();

    if (
      !js_form.name.trim() ||
      !js_form.ingredients.trim() ||
      !js_form.steps.trim() ||
      js_form.cookingTime === "" ||
      Number(js_form.cookingTime) <= 0
    ) {
      js_setMessage("Please enter valid values in all required fields.");
      return;
    }

    if (js_editId !== null) {
      js_setRecipes(
        js_recipes.map((js_recipe) =>
          js_recipe.id === js_editId
            ? { ...js_form, id: js_editId }
            : js_recipe
        )
      );

      js_setMessage("Recipe updated successfully!");
    } else {
      const js_newRecipe = {
        ...js_form,
        id: Date.now()
      };

      js_setRecipes([...js_recipes, js_newRecipe]);
      js_setMessage("Recipe added successfully!");
    }

    js_setForm({
      name: "",
      category: "Breakfast",
      ingredients: "",
      steps: "",
      cookingTime: ""
    });

    js_setEditId(null);
  }

  function js_handleEdit(js_recipe) {
    js_setForm({
      name: js_recipe.name,
      category: js_recipe.category,
      ingredients: js_recipe.ingredients,
      steps: js_recipe.steps,
      cookingTime: js_recipe.cookingTime
    });

    js_setEditId(js_recipe.id);
    js_setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function js_handleDelete(js_id) {
    const js_confirm = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (js_confirm) {
      js_setRecipes(
        js_recipes.filter((js_recipe) => js_recipe.id !== js_id)
      );

      js_setMessage("Recipe deleted successfully!");
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

          {js_message && (
            <div className="message" role="status">
              {js_message}
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
                    js_setMessage("");
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

          {js_recipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <h3>Your cookbook is waiting!</h3>
              <p>Add your first recipe using the form above.</p>
            </div>
          ) : (
            <div className="recipe-grid">
              {js_recipes.map((js_recipe) => (
                <article className="recipe-card" key={js_recipe.id}>
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

                  <details className="recipe-details">
                    <summary>View full recipe</summary>

                    <h4>Ingredients</h4>
                    <p className="detail-text">{js_recipe.ingredients}</p>

                    <h4>Preparation Steps</h4>
                    <p className="detail-text">{js_recipe.steps}</p>
                  </details>

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
                      onClick={() => js_handleDelete(js_recipe.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Made for food lovers, one recipe at a time. ♡</p>
      </footer>
    </div>
  );
}

export default App;

