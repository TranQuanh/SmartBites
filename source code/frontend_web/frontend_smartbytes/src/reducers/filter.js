const init = {
    query_filter: "",
    cook_filter: "",
    ingredients_filter: "",
    calories_filter: ""
};
const filterReducer = (state = init, action) => {
    // console.log(state);
    switch (action.type) {
        case "CREATE_FILTER":
            return {
                ...state,
                [action.filterType]: action.payload
            };
        case "REMOVE_FILTER":
            return {
                ...state,
                [action.filterType]: ""
            };
        case "CLEAR_FILTER":
            return {
                query_filter: "",
                cook_filter: "",
                ingredients_filter: "",
                calories_filter: ""
            };
        default:
            return state;
    }
}
export default filterReducer;