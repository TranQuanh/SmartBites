import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecipeDetail.scss';
import { MdOutlineBookmarkAdd } from "react-icons/md";

function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Kiểm tra xem công thức có được lưu trong localStorage chưa
        const savedList = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        setSaved(savedList.includes(Number(id)));

        // Lấy chi tiết công thức
        async function fetchRecipe() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:3000/api/recipes/${id}`);
                if (!res.ok) throw new Error('Recipe not found');
                const data = await res.json();
                setRecipe(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchRecipe();
    }, [id]);

    const handleSave = () => {
        let savedList = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        if (saved) {
            // Xóa ID khỏi danh sách nếu đã lưu
            savedList = savedList.filter(savedId => savedId !== Number(id));
        } else {
            // Thêm ID vào danh sách nếu chưa lưu
            savedList.push(Number(id));
        }
        localStorage.setItem("savedRecipes", JSON.stringify(savedList));
        setSaved(!saved);
        // Gửi sự kiện để đồng bộ với các thành phần khác
        window.dispatchEvent(new Event("savedRecipesChanged"));
    };

    if (loading) return <div className="detail-page-main"><p>Loading...</p></div>;
    if (error) return <div className="detail-page-main"><p>{error}</p></div>;
    if (!recipe) return null;

    // Lấy các stats
    const stats = [
        { label: "Ingredients", value: recipe.filter?.ingredients },
        { label: "Minutes Prep", value: recipe.filter?.prep },
        { label: "Minutes Cook", value: recipe.filter?.cook },
        { label: "Calories", value: recipe.filter?.calories }
    ];

    // Lấy thông tin dinh dưỡng
    const nutritionKeys = [
        "calories", "fat", "saturatedFat", "cholesterol", "sodium", "carbohydrates", "fiber", "sugars", "protein"
    ];
    const nutritions = recipe.nutritions || {};

    return (
        <div className="detail-page-main">
            <div className="article container detail-page" data-detail-container>
                <figure className="detail-banner img-holder">
                    <img src={recipe.image_url} width="300" height="300" alt={recipe.recipe_name} className="img-cover"/>
                </figure>
                <div className="detail-content">
                    <div className="title-wrapper">
                        <h1 className="display-small">{recipe.recipe_name}</h1>
                        <button 
                            className={`btn btn-secondary has-state has-icon ${saved ? '' : 'removed'}`}
                            onClick={handleSave}
                            title={saved ? "Unsave" : "Save"}
                        >
                            <span className="material-symbols-outlined bookmark-add">
                                <MdOutlineBookmarkAdd />
                            </span>
                            <span className="label-large save-text">{saved ? 'Unsave' : 'Save'}</span>
                        </button>
                    </div>

                    <div className="detail-stats-row">
                        {stats.map((stat, idx) => (
                            <div className="stats-item" key={stat.label}>
                                <span className="display-medium">{stat.value}</span>
                                <span className="label-medium">{stat.label}</span>
                                {idx < stats.length - 1 && <span className="stats-divider" />}
                            </div>
                        ))}
                    </div>

                    <div className="ingredients-section">
                        <h2 className="section-title">Ingredients</h2>
                        <div className="ingredients-list">
                            {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ing, idx) => (
                                <div className="ingredient-box" key={idx}>{ing}</div>
                            ))}
                        </div>
                    </div>

                    <div className="nutrition-section">
                        <h2 className="section-title">Nutrition Facts</h2>
                        <div className="nutrition-list">
                            {nutritionKeys.map(key => {
                                const n = nutritions[key];
                                if (!n || !n.hasCompleteData) return null;
                                return (
                                    <div className="nutrition-box" key={key}>
                                        <span className="nutrition-name">{n.name}</span>
                                        <span className="nutrition-value">{n.displayValue}{n.unit && <span className="nutrition-unit"> {n.unit}</span>}</span>
                                        {n.percentDailyValue && n.percentDailyValue !== "-" && (
                                            <span className="nutrition-percent">{n.percentDailyValue}%</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="direction-section">
                        <h2 className="section-title">Cooking Directions</h2>
                        <ol className="direction-list">
                            {Array.isArray(recipe.cooking_directions) && recipe.cooking_directions.map((step, idx) => (
                                <li key={idx} className="direction-step">{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail;