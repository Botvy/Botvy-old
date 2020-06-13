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
     * @type {('dark' | 'white')}
     * @memberof IClientSettings
     */
    theme: 'dark' | 'white';

    /**
     * Contains the plugin ids of all active plugins
     *
     * @type {string[]}
     * @memberof IClientSettings
     */
    activePlugins: string[];
}
