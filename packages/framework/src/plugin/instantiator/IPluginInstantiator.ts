import { IPluginDescriptionFile } from '../IPlugin';
import { Plugin } from '../Plugin';

/**
 * The plugin instantiator will be used to instantiate the plugin classes
 *
 * @export
 * @interface PluginInstantiator
 * @example Based of plugin descriptor files
 */
export interface IPluginInstantiator {
    /**
     * Instantiates the plugins
     *
     * @memberof IPluginInstantiator
     */
    instantiatePlugins: (
        pluginDescriptorFiles: IPluginDescriptionFile[],
    ) => Promise<Plugin[]>;
}
