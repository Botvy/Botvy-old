import { IPluginInstantiator } from '@botvy/framework/plugin/instantiator/IPluginInstantiator';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';

import { ServiceConstants } from '../ioc/ServiceConstants';
import { IPlugin, IPluginDescriptionFile } from './IPlugin';
import { IPluginLoader } from './loader/IPluginLoader';
import { Plugin } from './Plugin';
import { PluginDependencyResolver } from './PluginDependencyResolver';

/**
 * The plugin manager takes care of loaded plugins
 * and loads them in the correct order based
 * on the plugin dependencies
 *
 * @export
 * @class PluginManager
 */
@injectable()
export class PluginManager {
    /**
     * Contains the loaded plugins
     *
     * @private
     * @type {Plugin[]}
     * @memberof PluginManager
     */
    private loadedPlugins: Plugin[];

    /**
     * Contains the ordered plugins
     *
     * @public
     * @type {IPluginDescriptionFile[]}
     * @memberof PluginManager
     */
    public orderedPlugins: IPlugin[];

    /**
     * Creates an instance of PluginManager.
     * @param {Logger} logger The logger which should be used to log messages
     * @param {PluginDependencyResolver} pluginDependencyResolver The plugin dependency resolver which should be used
     *                                                            for determining the correct order of the plugins
     * @param {IPluginLoader} pluginLoader The plugin loader which loads plugins from a backend
     * @param {IPluginInstantiator} pluginInstantiator The plugin instantiator instantiates plugins based on their
     *                                                 IPluginDescriptionFile
     * @memberof PluginManager
     */
    constructor(
        @inject(ServiceConstants.System.Logger)
        private readonly logger: Logger,
        @inject(PluginDependencyResolver)
        private readonly pluginDependencyResolver: PluginDependencyResolver,
        @inject(ServiceConstants.System.Plugin.Loader.PluginLoader)
        private readonly pluginLoader: IPluginLoader,
        @inject(ServiceConstants.System.Plugin.Instantiator)
        private readonly pluginInstantiator: IPluginInstantiator,
    ) {
        this.loadedPlugins = [];
        this.orderedPlugins = [];
    }

    /**
     * Loads all plugins from the plugin loaders
     *
     * @param {string[]} activePlugins An array of all activated plugin ids
     * @memberof PluginManager
     */
    public async loadPlugins(activePlugins: string[]) {
        const availablePlugins = await this.pluginLoader.loadPlugins();
        availablePlugins.filter(plugin => {
            return activePlugins.includes(plugin.id);
        }).forEach(plugin => {
            this.pluginDependencyResolver.addFoundPlugin(plugin);
        });

        this.orderedPlugins = this.pluginDependencyResolver.resolvePlugins();
        this.loadedPlugins = await this.pluginInstantiator.instantiatePlugins(
            this.orderedPlugins as IPluginDescriptionFile[],
        );
    }

    /**
     * Initializes all ordered plugins
     *
     * @memberof PluginManager
     */
    public async initializePlugins() {
        this.logger.info('Initializing plugins');

        for (const plugin of this.loadedPlugins) {
            const { id: pluginId } = plugin;

            try {
                this.logger.silly(`Initializing plugin: ${pluginId}`);
                await plugin.initialize();
                this.logger.silly(`Initialized plugin: ${pluginId}`);
            } catch (error) {
                this.logger.error(
                    `Could not initialize plugin ${pluginId}: ${error}`,
                );
            }
        }
    }
}
