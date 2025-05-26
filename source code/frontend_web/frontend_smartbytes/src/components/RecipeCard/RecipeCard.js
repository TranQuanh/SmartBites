import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa6";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import "./RecipeCard.scss";

function RecipeCard({ recipe }) {
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
                    <div className="save-card">
                        <MdOutlineBookmarkAdd />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;
