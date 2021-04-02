// Reducer Types
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_VOICE_STATE = 'SET_VOICE_STATE';
export const SET_OPTIONS = 'SET_OPTIONS';
export const SET_USER_CHOICE = 'SET_USER_CHOICE';
export const SET_COMMAND = 'SET_COMMAND';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';

export function setMessage(message, dispatch) {
    dispatch({type: SET_MESSAGE, payload: message});
};

export function setCommand(command, dispatch) {
    dispatch({type: SET_COMMAND, payload: command});
}

export function setVoiceState(state, dispatch) {
    dispatch({type: SET_VOICE_STATE, payload: state});
}

export function setErrorMessage(message, dispatch) {
    dispatch({type: SET_ERROR_MESSAGE, payload: message});
}

export function setUserChoice(message, dispatch) {
    dispatch({type: SET_USER_CHOICE, payload: message});
}

export function setOptions(message, dispatch) {
    dispatch({type: SET_OPTIONS, payload: message});
}