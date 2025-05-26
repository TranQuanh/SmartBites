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
      <h2 className="headline-small" style={{marginBottom: 24}}>Recipe Recommendation</h2>
      <div className="recomendation-desc">
        Please fill in the necessary information about your desired nutrition mode.
      </div>
      <form className="recomendation-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Calories</label>
            <input name="calories" type="number" value={form.calories} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Fat</label>
            <input name="fat" type="number" value={form.fat} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Carbohydrates</label>
            <input name="carbohydrates" type="number" value={form.carbohydrates} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Protein</label>
            <input name="protein" type="number" value={form.protein} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Cholesterol</label>
            <input name="cholesterol" type="number" value={form.cholesterol} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Sodium</label>
            <input name="sodium" type="number" value={form.sodium} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Fiber</label>
            <input name="fiber" type="number" value={form.fiber} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{flex: 1}}>
            <label>Ingredients (comma separated)</label>
            <input name="ingredients" type="text" value={form.ingredients} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{marginTop: 16, minWidth: 120}}>
          {loading ? "Loading..." : "Recommend"}
        </button>
      </form>
      {recipes && recipes.length > 0 && (
        <div className="recomendation-banner">
          3 products suitable for your nutrition mode
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      <div className="grid-list" data-grid-list style={{marginTop: 32}}>
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