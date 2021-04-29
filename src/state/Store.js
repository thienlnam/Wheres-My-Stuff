import React, {createContext, useReducer} from 'react';
import Reducer from './Reducer';
import PropTypes from 'prop-types';


const initialState = {
    voiceState: 'READY',
    message: '',
    errorMessage: '',
    options: [],
    command: {},
    userChoice: [],
};

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    );
};

Store.propTypes = {
    children: PropTypes.node,
};

export const Context = createContext(initialState);
export default Store;
