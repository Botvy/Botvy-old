import { combineReducers, compose, createStore } from 'redux';

import { InitializationReducer } from './initialization/initialization.reducer';
import { ThemeReducer } from './theme/theme.reducer';

const composeEnhancers =
    (typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

export const store = createStore(
    combineReducers({
        theme: ThemeReducer,
        initialization: InitializationReducer,
    }),
    composeEnhancers(),
);
