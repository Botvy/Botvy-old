import { IInitializationState } from './initialization/IInitializationState';
import { ITheme } from '@botvy/framework/dist/theming/ITheme';

/**
 * Defines the root state of the application
 *
 * @export
 * @interface IRootState
 */
export interface IRootState {
    /**
     * Contains the state for theming the application
     *
     * @type {ITheme}
     * @memberof IRootState
     */
    theme: ITheme;

    /**
     * Contains the state for the application initialization
     *
     * @type {IInitializationState}
     * @memberof IRootState
     */
    initialization: IInitializationState;
}
