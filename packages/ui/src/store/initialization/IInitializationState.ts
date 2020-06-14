/**
 * Describes the initialization side
 *
 * @export
 * @interface IInitializationState
 */
export interface IInitializationState {
    /**
     * When the application is initializing, this value is set to true
     *
     * @type {boolean}
     * @memberof IInitializationState
     */
    initializing: boolean;

    /**
     * Contains the name of the current operation
     *
     * @type {string}
     * @memberof IInitializationState
     */
    step?: string;

    /**
     * Contains the content of the current sub operation
     *
     * @type {string}
     * @memberof IInitializationState
     */
    subStep?: string;
}
