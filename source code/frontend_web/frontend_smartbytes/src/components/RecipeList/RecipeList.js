import "./RecipeList.scss";
import { IoFilter } from "react-icons/io5";
import {useState} from 'react';
import FilterBar from "../FilterBar/FilterBar";
function RecipeList(){
    const[showFilterbar,setShowFilterbar] = useState(false);
    function closeFilterbar(){
        setShowFilterbar(false);
    }
    return(
        <>
            {showFilterbar &&<FilterBar close={closeFilterbar}/>}
            <div className="recipe-container container">
                <div className="title-wrapper">
                    <h2 className="headline-small">All Recipes</h2>
                    <button className="btn btn-secondary btn-filter has-state has-icon " onClick={()=>setShowFilterbar(true)}aria-label="Open filter bar"  >
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
                <div className="load-more grid-list" data-load-more>
                    <p className="info-text body-medium">Lorem ipsum dolor, sit asdgsdga
                        lasdkgjlsad adfas,dsagdsa.                    
                        </p>
                </div>
            </div>
        </>
    )
}
export default RecipeList