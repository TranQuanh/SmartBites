export const createFilter = (value,type) =>{
    return {
        type: "CREATE_FILTER",
        filterType: type,
        payload: value
    }
}
export const removeFilter = (value,type) =>{
    return {
        type: "REMOVE_FILTER",
        filterType: value,
    }
}
export const clearFilter = () =>{
    return {
        type: "CLEAR_FILTER",
    }
}