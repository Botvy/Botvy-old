import { AnyAction } from 'redux';

import { IInitializationState } from './IInitializationState';
import {
    FINISH_INITIALIZATION,
    SET_STEP_INFO,
    SET_SUBSTEP_INFO,
} from './initialization.actions';

const initialState: IInitializationState = {
    initializing: true,
    step: undefined,
    subStep: undefined,
};

export const InitializationReducer = (
    state: IInitializationState | undefined,
    action: AnyAction,
): IInitializationState => {
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case SET_STEP_INFO:
            return {
                ...state,
                step: action.step,
            };

        case SET_SUBSTEP_INFO:
            return {
                ...state,
                subStep: action.subStep,
            };

        case FINISH_INITIALIZATION:
            return {
                ...state,
                initializing: false,
                step: undefined,
                subStep: undefined,
            };
    }

    return state;
};
