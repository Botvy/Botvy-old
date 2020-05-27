/**
 * The initialization side can be used to determine on which side the plugin
 * will be initialized. The only values are "CLIENT" and "SERVER"
 */
export enum InitializationSide {
    /**
     * When the chatbot is initialized by the electron main process
     */
    CLIENT,

    /**
     * When the chatbot is initialized by the server
     */
    SERVER,
}
