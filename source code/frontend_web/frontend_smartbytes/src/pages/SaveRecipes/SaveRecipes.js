import { useEffect, useState } from "react";
import RecipeCard from "../../components/RecipeCard/RecipeCard";

function SaveRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm lấy lại danh sách recipe đã lưu từ localStorage và gọi API
    const fetchSavedRecipes = () => {
        const savedList = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        if (savedList.length === 0) {
            setRecipes([]);
            setLoading(false);
            return;
        }
        fetch(`http://localhost:3000/api/recipes?ids=${savedList.join(",")}`)
            .then(res => res.json())
            .then(data => {
                // Chỉ giữ lại các recipe có id nằm trong savedList và đúng thứ tự đã lưu
                const filtered = savedList
                    .map(id => (data.recipes || []).find(r => r.id === id))
                    .filter(Boolean);
                setRecipes(filtered);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchSavedRecipes();
        // Lắng nghe sự kiện lưu/xoá recipe ở các tab khác (nếu có)
        window.addEventListener("storage", fetchSavedRecipes);
        return () => window.removeEventListener("storage", fetchSavedRecipes);
    }, []);

    // Khi user lưu/xoá recipe ở tab hiện tại, cập nhật lại danh sách
    useEffect(() => {
        const handler = () => fetchSavedRecipes();
        window.addEventListener("savedRecipesChanged", handler);
        return () => window.removeEventListener("savedRecipesChanged", handler);
    }, []);

    return (
        <div className="recipe-container container">
            <h2 className="headline-small" style={{marginBottom: 24}}>Saved Recipes</h2>
            <div className="grid-list" data-grid-list>
                {loading ? (
                    <p>Loading...</p>
                ) : recipes.length === 0 ? (
                    <div className="no-recipe-quote">
                        <p>No saved recipes yet.</p>
                    </div>
                ) : (
                    recipes.map(recipe => (
                        <div className="col" key={recipe.id}>
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SaveRecipes;
