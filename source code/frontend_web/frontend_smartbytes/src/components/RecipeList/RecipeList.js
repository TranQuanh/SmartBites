import "./RecipeList.scss";
import { IoFilter } from "react-icons/io5";
import { useState, useEffect, useRef, useCallback } from "react";
import FilterBar from "../FilterBar/FilterBar";
import { useSelector } from "react-redux";
import SkeletonCard from "../skeletonCard/skeletonCard";
import { FaClock } from "react-icons/fa6";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import RecipeCard from "../RecipeCard/RecipeCard";
function RecipeList() {
    const filter = useSelector((state) => state.filterReducer);
    const [filternumber, setFilterNumber] = useState(0);
    const [showFilterbar, setShowFilterbar] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [filterQuery, setFilterQuery] = useState("");
    const filterBtnRef = useRef(null);
    const observerRef = useRef(null);
    const [isFetching, setIsFetching] = useState(false); // prevent double fetch

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

    // Reset recipes and page when filter changes
    useEffect(() => {
        setRecipes([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [filterQuery]);

    const fetchRecipes = useCallback(async (fetchPage = page) => {
        if (loading || isFetching || !hasMore) return;
        setLoading(true);
        setIsFetching(true);
        try {
            const queryParams = new URLSearchParams({
                page: fetchPage,
                limit: 20,
            });
            if (filterQuery) {
                filterQuery.split('&').forEach(pair => {
                    const [k, v] = pair.split('=');
                    if (k && v) queryParams.set(k, decodeURIComponent(v));
                });
            }
            const response = await fetch(`http://localhost:3000/api/recipes?${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRecipes(prev => fetchPage === 1 ? data.recipes : [...prev, ...data.recipes]);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setError(error.message || "Unable to load recipes");
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }, [page, hasMore, filterQuery, loading, isFetching]);

    useEffect(() => {
        fetchRecipes(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, filterQuery]);

    const lastRecipeElementRef = useCallback(
        (node) => {
            if (loading || !hasMore || isFetching) return;
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new window.IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore && !loading && !isFetching) {
                        setPage((prev) => prev + 1);
                    }
                },
                { threshold: 1.0 }
            );
            if (node) observerRef.current.observe(node);
        },
        [loading, hasMore, isFetching]
    );

    return (
        <>
            {showFilterbar && <FilterBar close={closeFilterbar} onApply={setFilterQuery} />}
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
                    {recipes.length === 0 && !loading && !error ? (
                        <div className="no-recipe-quote">
                            <p>No recipes found. Try another search or filter!</p>
                        </div>
                    ) : (
                        recipes.map((recipe, index) => {
                            const isLastRecipe = index === recipes.length - 1;
                            return (
                                <div
                                    className="col"
                                    key={recipe.id}
                                    ref={isLastRecipe ? lastRecipeElementRef : null}
                                >
                                    <RecipeCard recipe={recipe} />
                                </div>
                            );
                        })
                    )}
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