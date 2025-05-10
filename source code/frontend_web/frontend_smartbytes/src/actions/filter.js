export const createFilter = (filter,type) =>{
    return {
        type: "CREATE_FILTER",
        filterType: type,
        payload: filter
    }
}
export const removeFilter = (filter,type) =>{
    return {
        type: "REMOVE_FILTER",
        filterType: filter
    }
}
export const clearFilter = () =>{
    return {
        type: "CLEAR_FILTER",
    }
}