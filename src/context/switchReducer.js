
export const switchReducer = (state,action)=>{
    switch (action.type) {
        case "changeNumber":
            return { ...state, number: action.numberInc };
            case "setCitites":
                return { ...state, cities: action.cities };
            default:
                return state;
    }
}