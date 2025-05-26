import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa6";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import "./RecipeCard.scss";
import { useEffect, useState } from "react";

function RecipeCard({ recipe }) {
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedList = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        setSaved(savedList.includes(recipe.id));
    }, [recipe.id]);

    const handleSave = (e) => {
        e.preventDefault();
        let savedList = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        if (saved) {
            savedList = savedList.filter(id => id !== recipe.id);
        } else {
            savedList.push(recipe.id);
        }
        localStorage.setItem("savedRecipes", JSON.stringify(savedList));
        setSaved(!saved);
        // Gửi sự kiện để các trang khác cập nhật lại danh sách đã lưu
        window.dispatchEvent(new Event("savedRecipesChanged"));
    };

    return (
        <div className="card">
            <Link to={`/recipes/${recipe.id}`} className="card-link">
                <img
                    src={recipe.image}
                    alt={recipe.recipe_name}
                    className="card-img-top"
                />
                <div className="card-body">
                    <h5 className="card-title">{recipe.recipe_name}</h5>
                </div>
            </Link>
            <div className="card-body">
                <div className="card-text-wrapper">
                    <div className="card-cook-time">
                        <div className="cook-time-icon">
                            <FaClock />
                        </div>
                        <p className="card-text">
                            {recipe.cook} minutes
                        </p>
                    </div>
                    <div
                        className={`save-card${saved ? " selected" : ""}`}
                        onClick={handleSave}
                        title={saved ? "Unsave" : "Save"}
                    >
                        <MdOutlineBookmarkAdd />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;
