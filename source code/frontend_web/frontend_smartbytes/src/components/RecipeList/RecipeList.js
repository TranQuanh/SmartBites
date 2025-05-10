import "./RecipeList.scss";
import { IoFilter } from "react-icons/io5";
import { useState, useEffect } from "react";
import FilterBar from "../FilterBar/FilterBar";
import { useSelector } from "react-redux";

function RecipeList() {
    const filter = useSelector((state) => state.filter);
    const [filternumber, setFilterNumber] = useState(0);
    const [showFilterbar, setShowFilterbar] = useState(false);

    function closeFilterbar() {
        setShowFilterbar(false);
    }

    useEffect(() => {
        // Count filters that are not empty
        const count = Object.values(filter).filter((value) => value !== "").length;
        setFilterNumber(count);
    }, [filter]);

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

                <div className="grid-list" data-grid-list></div>
                <div className="load-more grid-list" data-load-more>
                    <p className="info-text body-medium">
                        Lorem ipsum dolor, sit asdgsdga lasdkgjlsad adfas,dsagdsa.
                    </p>
                </div>
            </div>
        </>
    );
}

export default RecipeList;