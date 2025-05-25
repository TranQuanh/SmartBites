import "./FilterBar.scss";
import { IoFilter } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { IoTimer } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import { PiCookingPotFill } from "react-icons/pi";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFilter, clearFilter } from "../../actions/filter";

function FilterBar({ close, onApply }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filter); // Access filter state from Redux
  const [expanded, setExpanded] = useState({
    "cook-time": false,
    ingr: false,
    calories: false,
  });

  // Hàm toggle cho accordion
  const toggleAccordion = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSelectedFilterFromDiv = (div) => {
    const selectedFilter = div.querySelector('input[type="radio"]:checked');
    if (selectedFilter) {
      return [selectedFilter.name, selectedFilter.value];
    }
    return null;
  };

  const applyFilter = () => {
    dispatch(clearFilter());
    const selected = [];
    const searchInput = document.querySelector('input[type="search"]');
    const searchValue = searchInput?.value.trim();
    if (searchValue) {
      selected.push(["q", searchValue]);
      dispatch(createFilter(searchValue, "query_filter"));
    }
    const filterDivs = document.querySelectorAll('.accordion-overflow[data-filter]');
    filterDivs.forEach((div) => {
      const filter = getSelectedFilterFromDiv(div);
      if (filter) {
        const [filterType, filterValue] = filter;
        const filterTypeMap = {
          "cook-time": "cook",
          ingr: "ingredients",
          calories: "calories",
        };
        const queryKey = filterTypeMap[filterType];
        if (queryKey) {
          selected.push([queryKey, filterValue]);
        }
        const filterTypeMapRedux = {
          "cook-time": "cook_filter",
          ingr: "ingredients_filter",
          calories: "calories_filter",
        };
        const reduxFilterType = filterTypeMapRedux[filterType];
        if (reduxFilterType) {
          dispatch(createFilter(filterValue, reduxFilterType));
        }
      }
    });
    // Build query string for backend
    const queryString = selected.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    if (onApply) onApply(queryString);
    close();
  };

  const clearFilters = () => {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) searchInput.value = "";
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => (radio.checked = false));
    dispatch(clearFilter());
  };

  
  return (
    <>
      <div className="overlay active" onClick={close}></div>
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
              <label htmlFor="search" className="body-large label">
                Search
              </label>
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search recipes"
                className="input-field body-large"
                defaultValue={filters.query_filter} // Set search input value from Redux
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilter();
                    close();
                  }
                }}
              />
            </div>
          </div>
          {/* Cooking Time */}
          <div className="accordion-container">
            <button
              className="accordion-btn has-state"
              aria-expanded={expanded["cook-time"]}
              onClick={() => toggleAccordion("cook-time")}
            >
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
                {[
                  { label: "< 5 minutes", value: "5" },
                  { label: "5 - 10 minutes", value: "5-10" },
                  { label: "10 - 20 minutes", value: "10-20" },
                  { label: "20 - 30 minutes", value: "20-30" },
                  { label: "30 - 40 minutes", value: "30-40" },
                  { label: "40 - 50 minutes", value: "40-50" },
                  { label: "50 - 60 minutes", value: "50-60" },
                  { label: "> 1 hours", value: "60+" },
                ].map((option) => (
                  <label className="filter-chip label-large" key={option.value}>
                    {option.label}
                    <input
                      type="radio"
                      name="cook-time"
                      value={option.value}
                      className="checkbox"
                      aria-label={option.label}
                      defaultChecked={filters.cook_filter === option.value} // Pre-check based on Redux state
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* End Cooking Time */}

          {/* Ingredients */}
          <div className="accordion-container">
            <button
              className="accordion-btn has-state"
              aria-expanded={expanded["ingr"]}
              onClick={() => toggleAccordion("ingr")}
            >
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
                {[
                  { label: "< 5 ingredients", value: "5" },
                  { label: "5 - 10 ingredients", value: "5-10" },
                  { label: "10 - 20 ingredients", value: "10-20" },
                  { label: "20 - 30 ingredients", value: "20-30" },
                  { label: "> 30 ingredients", value: "30+" },
                ].map((option) => (
                  <label className="filter-chip label-large" key={option.value}>
                    {option.label}
                    <input
                      type="radio"
                      name="ingr"
                      value={option.value}
                      className="checkbox"
                      aria-label={option.label}
                      defaultChecked={filters.ingredients_filter === option.value} // Pre-check based on Redux state
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* End Ingredients */}

          {/* Calories */}
          <div className="accordion-container">
            <button
              className="accordion-btn has-state"
              aria-expanded={expanded["calories"]}
              onClick={() => toggleAccordion("calories")}
            >
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
                {[
                  { label: "< 50 calories", value: "50" },
                  { label: "50 - 100 calories", value: "50-100" },
                  { label: "100 - 200 calories", value: "100-200" },
                  { label: "200 - 300 calories", value: "200-300" },
                  { label: "300 - 400 calories", value: "300-400" },
                  { label: "400 - 500 calories", value: "400-500" },
                  { label: "> 500 calories", value: "500+" },
                ].map((option) => (
                  <label className="filter-chip label-large" key={option.value}>
                    {option.label}
                    <input
                      type="radio"
                      name="calories"
                      value={option.value}
                      className="checkbox"
                      aria-label={option.label}
                      defaultChecked={filters.calories_filter === option.value} // Pre-check based on Redux state
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* End Calories */}

          <div className="filter-actions">
            <button
              className="btn btn-secondary label-large has-state"
              onClick={clearFilters}
            >
              CLEAR
            </button>
            <button
              className="btn btn-primary label-large"
              onClick={applyFilter}
            >
              APPLY
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterBar;