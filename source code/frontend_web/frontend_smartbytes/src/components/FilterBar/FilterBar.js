import "./FilterBar.scss";
import { IoFilter } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { IoTimer } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import { PiCookingPotFill } from "react-icons/pi";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { useState } from "react";
function FilterBar({close}){
    const [expanded, setExpanded] = useState({
        "cook-time": false,
        "ingr": false,
        "calories": false,
      });
    
      // Hàm toggle cho accordion
      const toggleAccordion = (section) => {
        setExpanded((prev) => ({
          ...prev,
          [section]: !prev[section], // Toggle true/false cho section tương ứng
        }));
      };

      const getSelectedFilterFromDiv = (div) =>{
        const selectedFilter = div.querySelector('input[type="radio"]:checked');
        if (selectedFilter) {
            return [selectedFilter.name, selectedFilter.value];
        }
        return null; // H
      };

      const applyFilter = () => {
        const selected = [];
        const searchInput = document.querySelector('input[type="search"]');
        const searchValue = searchInput?.value.trim();
        if (searchValue) {
            selected.push(["q", searchValue]);
        }
        const filterDivs = document.querySelectorAll('.accordion-overflow[data-filter]');
        filterDivs.forEach((div) => {
            const filter = getSelectedFilterFromDiv(div);
            if (filter) {
                selected.push(filter);
            }
        }); 
        const queryString = selected.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

        console.log( queryString);
    }; 

    const clearFilters = () => {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) searchInput.value = "";
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio) => (radio.checked = false));
    };

    return(
        <>
            <div className= "overlay active" onClick={close}></div>
            <div className="filter-bar active">
                <div className="title-wrapper">
                    <span className="filter-icon material-symbols-outlined">
                        <IoFilter />
                    </span>
                    <p className="title-medium">Filters</p>
                    <button className="icon-btn close-btn has-state" onClick={close}>
                        <IoClose />
                    </button>
                </div>
                <div className="filter-content">
                    <div className="search-wrapper">
                        <div className="input-oulined">
                            <label  htmlFor="search" className="body-large label" >Search</label>
                            <input type="search" name="search" id ="search" placeholder="Search recipes" className="input-field body-large" onKeyDown={applyFilter}/>
                        </div>
                        
                    </div>
                    {/* cooking time */}
                    <div className="accordion-container">
                        <button className="accordion-btn has-state" aria-expanded={expanded["cook-time"]} onClick={() => toggleAccordion("cook-time")}>
                            <span className="accordion-icon">
                                <IoTimer />
                            </span>
                            <p className="label-large">Cooking Time</p>
                            <span className="material-symbols-outlined trailing-icon">
                                <MdExpandMore />
                            </span>
                        </button>
                        <div className="accordion-content" id="cook-time">
                            <div className="accordion-overflow" data-filter="time">
                                <label className="filter-chip label-large">
                                    &lt; 5 minutes
                                    <input type="radio" name="cook-time" value="5" className="checkbox" aria-label="5 or less minutes"/>
                                </label>
                                
                                <label className="filter-chip label-large">
                                    5 - 10 minutes
                                    <input type="radio" name="cook-time" value="5-10" className="checkbox" aria-label="5 to 10 minutes"/>
                                </label>

                                <label className="filter-chip label-large">
                                    10 - 20 minutes
                                    <input type="radio" name="cook-time" value="10-20" className="checkbox" aria-label="10 to 20 minutes"/>
                                </label>

                                <label className="filter-chip label-large">
                                    20 - 30 minutes
                                    <input type="radio" name="cook-time" value="20-30" className="checkbox" aria-label="20 to 30 minutes"/>
                                </label>

                                <label className="filter-chip label-large">
                                    30 - 40 minutes
                                    <input type="radio" name="cook-time" value="30-40" className="checkbox" aria-label="30 to 40 minutes"/>
                                </label>

                                <label className="filter-chip label-large">
                                    40 - 50 minutes
                                    <input type="radio" name="cook-time" value="40-50" className="checkbox" aria-label="40 to 50 minutes"/>
                                </label>

                                <label className="filter-chip label-large">
                                    50 - 60 minutes
                                    <input type="radio" name="cook-time" value="50-60" className="checkbox" aria-label="50 to 60 minutes"/>
                                </label>
                                <label className="filter-chip label-large">
                                    &gt; 1 hours
                                    <input type="radio" name="cook-time" value="60+" className="checkbox" aria-label="1 or more hours"/>
                                </label>

                            </div>
                        </div>
                    </div>
                    {/* End cooking time */}

                    {/* Ingredient */}
                    <div className="accordion-container">
                        <button className="accordion-btn has-state" aria-expanded={expanded["ingr"]} onClick={() => toggleAccordion("ingr")}>
                            <span className="accordion-icon">
                                <PiCookingPotFill />
                            </span>
                            <p className="label-large">Ingredients</p>
                            <span className="material-symbols-outlined trailing-icon">
                                <MdExpandMore />
                            </span>
                        </button>
                        <div className="accordion-content" id="ingr">
                            <div className="accordion-overflow" data-filter="ingredients">
                                <label className="filter-chip label-large">
                                    &lt; 5 ingredients
                                    <input type="radio" name="ingr" value="5" className="checkbox" aria-label="5 or less ingredients"/>
                                </label>
                                
                                <label className="filter-chip label-large">
                                    5 - 10 ingredients
                                    <input type="radio" name="ingr" value="5-10" className="checkbox" aria-label="5 to 10 ingredients"/>
                                </label>

                                <label className="filter-chip label-large">
                                    10 - 20 ingredients
                                    <input type="radio" name="ingr" value="10-20" className="checkbox" aria-label="10 to 20 ingredients"/>
                                </label>

                                <label className="filter-chip label-large">
                                    20 - 30 ingredients
                                    <input type="radio" name="ingr" value="20-30" className="checkbox" aria-label="20 to 30 ingredients"/>
                                </label>

                                <label className="filter-chip label-large">
                                    &gt; 30 ingredients
                                    <input type="radio" name="ingr" value="30+" className="checkbox" aria-label="30 or more ingredients"/>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* End ingredient */}

                    {/* Calories */}
                    <div className="accordion-container">
                        <button className="accordion-btn has-state"aria-expanded={expanded["calories"]} onClick={() => toggleAccordion("calories")}>
                            <span className="accordion-icon">
                                <MdEnergySavingsLeaf />
                            </span>
                            <p className="label-large">Calories</p>
                            <span className="material-symbols-outlined trailing-icon">
                                <MdExpandMore />
                            </span>
                        </button>
                        <div className="accordion-content" id="calories">
                            <div className="accordion-overflow" data-filter="calories">
                                <label className="filter-chip label-large">
                                    &lt; 50 calories
                                    <input type="radio" name="calories" value="50" className="checkbox" aria-label="50 or less calories"/>
                                </label>
                                
                                <label className="filter-chip label-large">
                                    50 - 100 calories
                                    <input type="radio" name="calories" value="50-100" className="checkbox" aria-label="50 to 100 calories"/>
                                </label>

                                <label className="filter-chip label-large">
                                    100 - 200 calories
                                    <input type="radio" name="calories" value="100-200" className="checkbox" aria-label="100 to 200 calories"/>
                                </label>

                                <label className="filter-chip label-large">
                                    200 - 300 calories
                                    <input type="radio" name="calories" value="200-300" className="checkbox" aria-label="200 to 300 calories"/>
                                </label>

                                <label className="filter-chip label-large">
                                    300 - 400 calories
                                    <input type="radio" name="calories" value="300-400" className="checkbox" aria-label="300 to 400 calories"/>
                                </label>

                                <label className="filter-chip label-large">
                                    400 - 500 calories
                                    <input type="radio" name="calories" value="400-500" className="checkbox" aria-label="400 to 500 calories"/>
                                </label>

                                <label className="filter-chip label-large">
                                    &gt; 500 calories
                                    <input type="radio" name="calories" value="500+" className="checkbox" aria-label="500 or more calories"/>
                                </label>

                            </div>
                        </div>
                    </div>
                    {/* End calories */}

                    <div className="filter-actions">
                        <button
                            className="btn btn-secondary label-large has-state"
                            onClick={clearFilters}
                        >
                            CLEAR
                        </button>
                        <button
                            className="btn btn-primary label-large"
                            onClick={() => {
                                applyFilter();
                                close();
                            }}
                        >
                            APPLY
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default  FilterBar;