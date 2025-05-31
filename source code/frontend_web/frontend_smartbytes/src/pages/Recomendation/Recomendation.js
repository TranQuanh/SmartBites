import './Recomendation.scss';
import { useState } from "react";
import RecipeCard from "../../components/RecipeCard/RecipeCard";

function Recomendation() {
  const [form, setForm] = useState({
    calories: "",
    fat: "",
    carbohydrates: "",
    protein: "",
    cholesterol: "",
    sodium: "",
    fiber: "",
    ingredients: ""
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecipes([]);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/recipes/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        throw new Error("Recommendation failed");
      }
      const data = await res.json();
      if (data.recipes && data.recipes.length > 0) {
        setRecipes(data.recipes);
      } else {
        setError("No recommendations found.");
      }
    } catch (err) {
      setError("Recommendation failed.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recomendation-page container">
      <h2 className="headline-small">Recipe Recommendation</h2>
      <div className="recomendation-desc">
        Enter your desired nutritional values and ingredients to find the perfect recipes.
      </div>
      <form className="recomendation-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">Nutritional Preferences</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Calories (kcal)</label>
              <input
                name="calories"
                type="number"
                value={form.calories}
                onChange={handleChange}
                required
                placeholder="e.g., 500"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fat (g)</label>
              <input
                name="fat"
                type="number"
                value={form.fat}
                onChange={handleChange}
                required
                placeholder="e.g., 20"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Carbohydrates (g)</label>
              <input
                name="carbohydrates"
                type="number"
                value={form.carbohydrates}
                onChange={handleChange}
                required
                placeholder="e.g., 50"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input
                name="protein"
                type="number"
                value={form.protein}
                onChange={handleChange}
                required
                placeholder="e.g., 30"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cholesterol (mg)</label>
              <input
                name="cholesterol"
                type="number"
                value={form.cholesterol}
                onChange={handleChange}
                required
                placeholder="e.g., 100"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sodium (mg)</label>
              <input
                name="sodium"
                type="number"
                value={form.sodium}
                onChange={handleChange}
                required
                placeholder="e.g., 500"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fiber (g)</label>
              <input
                name="fiber"
                type="number"
                value={form.fiber}
                onChange={handleChange}
                required
                placeholder="e.g., 10"
                className="form-input"
              />
            </div>
          </div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Ingredients</h3>
          <div className="form-group form-group-full">
            <label className="form-label">Ingredients (comma separated)</label>
            <textarea
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              required
              placeholder="e.g., chicken, rice, broccoli"
              className="form-input form-textarea"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            "Find Recipes"
          )}
        </button>
      </form>
      {recipes && recipes.length > 0 && (
        <div className="recomendation-banner">
          {recipes.length} recipes found for your preferences
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <div className="grid-list">
        {recipes && recipes.length > 0 && recipes.map(recipe => (
          <div className="col" key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recomendation;