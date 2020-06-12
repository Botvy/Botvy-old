/**
 * The initialization side can be used to determine on which side the plugin
 * will be initialized. The values can be CLIENT, SERVER, TEST and UI
 *
 * @export
 * @enum {number}
 * @example You can bind dependency injection container bindings with additional container modules
 */
export enum InitializationSide {
    /**
     * When botvy is initialized by the user interface (react)
     */
    UI,

    /**
     * When botvy is initialized by the electron main process
     */
    CLIENT,

    /**
     * When botvy is initialized by the server
     */
    SERVER,

    /**
     * When botvy is initialized by test runners (jest)
     */
    TEST,
}
