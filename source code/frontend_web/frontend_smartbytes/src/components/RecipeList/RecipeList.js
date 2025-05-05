import "./RecipeList.scss";
import { IoFilter } from "react-icons/io5";
function RecipeList(){
    return(
        <>
            <div className="overlay" data-overlay data-filter-toggler></div>
            <div className="recipe-container container">
                <div className="title-wrapper">
                    <h2 className="headline-small">All Recipes</h2>
                    <button className="btn btn-secondary btn-filter has-state has-icon" aria-label="Open filter bar" >
                        <span className="material-symbols-outlined" aria-hidden="true">
                            <IoFilter />
                        </span>
                        <span className="wrapper">
                            <span className="label-large">Filters</span>
                            <div className="badge label-small">9</div>
                        </span>
                    </button>
                </div>

                <div className="grid-list" data-grid-list></div>
                <div className="load-more grid-list" data-load-more></div>
            </div>
        </>
    )
}
export default RecipeList