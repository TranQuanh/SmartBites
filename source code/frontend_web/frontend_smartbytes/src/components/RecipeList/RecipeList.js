import "./RecipeList.scss";
import { IoFilter } from "react-icons/io5";
import { useState, useEffect, useRef, useCallback } from "react";
import FilterBar from "../FilterBar/FilterBar";
import { useSelector } from "react-redux";
import SkeletonCard from "../skeletonCard/skeletonCard";
import { FaClock } from "react-icons/fa6";
import { MdOutlineBookmarkAdd } from "react-icons/md";
function RecipeList() {
    const filter = useSelector((state) => state.filterReducer);
    const [filternumber, setFilterNumber] = useState(0);
    const [showFilterbar, setShowFilterbar] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const filterBtnRef = useRef(null);
    const observerRef = useRef(null);

    function closeFilterbar() {
        setShowFilterbar(false);
    }

    useEffect(() => {
        const count = filter
            ? Object.values(filter).filter((value) => value !== "").length
            : 0;
        setFilterNumber(count);
    }, [filter]);

    useEffect(() => {
        const handleScroll = () => {
            if (filterBtnRef.current) {
                filterBtnRef.current.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const fetchRecipes = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page,
                limit: 40,
            });
            const response = await fetch(`http://localhost:3000/api/recipes?${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRecipes((prev) => [...prev, ...data.recipes]);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setError(error.message || "Unable to load recipes");
        } finally {
            setLoading(false);
        }
    }, [page, hasMore]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const lastRecipeElementRef = useCallback(
        (node) => {
            if (loading || !hasMore) return;
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setPage((prev) => prev + 1); // Trigger loading the next page
                    }
                },
                { threshold: 1.0 }
            );
            if (node) observerRef.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <>
            {showFilterbar && <FilterBar close={closeFilterbar} />}
            <div className="recipe-container container">
                <div className="title-wrapper">
                    <h2 className="headline-small">All Recipes</h2>
                    <button
                        className="btn btn-secondary btn-filter has-state has-icon"
                        onClick={() => setShowFilterbar(true)}
                        aria-label="Open filter bar"
                        data-filter-btn
                        ref={filterBtnRef}
                    >
                        <span className="material-symbols-outlined" aria-hidden="true">
                            <IoFilter />
                        </span>
                        <span className="wrapper">
                            <span className="label-large">Filters</span>
                            <div className="badge label-small">{filternumber}</div>
                        </span>
                    </button>
                </div>

                <div className="grid-list" data-grid-list>
                    {recipes.map((recipe, index) => {
                        const isLastRecipe = index === recipes.length - 1;
                        return (
                            <div
                                className="col"
                                key={recipe.id}
                                ref={isLastRecipe ? lastRecipeElementRef : null}
                            >
                                <div className="card">
                                    <img
                                        src={recipe.image}
                                        alt={recipe.recipe_name}
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{recipe.recipe_name}</h5>
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
                            </div>
                        );
                    })}
                    {loading &&
                        Array.from({ length: 20 }).map((_, index) => (
                            <SkeletonCard key={`skeleton-${index}`} />
                        ))}
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </>
    );
}

export default RecipeList;