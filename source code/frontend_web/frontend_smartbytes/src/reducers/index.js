import filterReducer from "./filter";
import { combineReducers } from "redux";

const allReducers = combineReducers({
    filter: filterReducer,
});
export default allReducers;