import { AnyAction } from 'redux';

export const SET_STEP_INFO = 'botvy/initialization/SET_STEP_INFO';
export const SET_SUBSTEP_INFO = 'botvy/initialization/SET_SUB_STEP_INFO';
export const FINISH_INITIALIZATION =
    'botvy/initialization/FINISH_INITIALIZATION';

/**
 * Returns an action with which the initialization can be finished
 */
export const finishInitialization = (): AnyAction => ({
    type: FINISH_INITIALIZATION,
});

/**
 * Returns an action which sets the current operation in the initialization process
 *
 * @param step The name of the operation
 */
export const setStepInfo = (step?: string): AnyAction => ({
    type: SET_STEP_INFO,
    step,
});

/**
 * Returns an action which sets the current sub operation in the initialization process
 *
 * @param subStep The name of the current sub operation
 */
export const setSubStepInfo = (subStep?: string): AnyAction => ({
    type: SET_SUBSTEP_INFO,
    subStep,
});
