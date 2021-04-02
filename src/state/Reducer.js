const Reducer = (state, action) => {
    switch (action.type) {
    case 'SET_VOICE_STATE':
        return {
            ...state,
            voiceState: action.payload,
        };
    case 'SET_MESSAGE':
        return {
            ...state,
            message: action.payload,
        };
    case 'SET_OPTIONS':
        return {
            ...state,
            options: action.payload,
        };
    case 'SET_USER_CHOICE':
        return {
            ...state,
            userChoice: action.payload,
        };
    case 'SET_COMMAND':
        return {
            ...state,
            command: action.payload,
        };
    case 'SET_ERROR_MESSAGE':
        return {
            ...state,
            errorMessage: action.payload,
        };
    default:
        return state;
    }
};

export default Reducer;
