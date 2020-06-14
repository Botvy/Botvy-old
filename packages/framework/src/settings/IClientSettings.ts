/**
 * Defines the client settings which will be loaded
 * when the client is initialized
 *
 * @export
 * @interface IClientSettings
 */
export interface IClientSettings {
    /**
     * Contains the theme name
     *
     * @type {string}
     * @memberof IClientSettings
     */
    theme: string;

    /**
     * Contains the plugin ids of all active plugins
     *
     * @type {string[]}
     * @memberof IClientSettings
     */
    activePlugins: string[];
}
