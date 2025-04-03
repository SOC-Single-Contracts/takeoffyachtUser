
export const switchReducer = (state,action)=>{
    switch (action.type) {
        case "changeNumber":
            return { ...state, number: action.numberInc };
            default:
                return state;
    }
}