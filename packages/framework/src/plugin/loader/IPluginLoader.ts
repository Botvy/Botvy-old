import { IPlugin } from '../IPlugin';

/**
 * Defines an interface for how plugins should be loaded
 *
 * @example This could be a directory or database based system
 */
export interface IPluginLoader {
    /**
     * Contains the human readable name
     */
    name: string;

    /**
     * Loads the plugins from the backend
     */
    loadPlugins: () => Promise<IPlugin[]>;
}
