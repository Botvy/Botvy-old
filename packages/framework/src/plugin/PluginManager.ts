import { inject, injectable, multiInject } from 'inversify';
import { Logger } from 'winston';

import { ServiceConstants } from '../ioc/ServiceConstants';
import { IPlugin } from './IPlugin';
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
     * The logger which will be used to log messages
     *
     * @private
     * @type {Logger}
     * @memberof PluginManager
     */
    private readonly logger: Logger;

    /**
     * Contains the plugin dependency resolver
     * The resolver determines the correct order of the plugins
     * in which they should be loaded cause of their dependencies
     *
     * @private
     * @type {PluginDependencyResolver}
     * @memberof PluginManager
     */
    private readonly pluginDependencyResolver: PluginDependencyResolver;

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
     * Contains all the plugin loaders
     *
     * @private
     * @type {IPluginLoader[]}
     * @memberof PluginManager
     */
    private pluginLoaders: IPluginLoader[];

    /**
     * Creates an instance of PluginManager.
     * @param {Logger} logger The logger which should be used to log messages
     * @param {PluginDependencyResolver} pluginDependencyResolver The plugin dependency resolver which should be used
     *                                                            for determining the correct order of the plugins
     * @param {IPluginLoader[]} pluginLoaders The plugin loaders which loads plugins from backends (directory based, database based)
     * @memberof PluginManager
     */
    constructor(
        @inject(ServiceConstants.System.Logger) logger: Logger,
        @inject(PluginDependencyResolver)
        pluginDependencyResolver: PluginDependencyResolver,
        @multiInject(ServiceConstants.System.Plugin.Loader.PluginLoader)
        pluginLoaders: IPluginLoader[],
    ) {
        logger.configure({
            defaultMeta: {
                tags: [PluginManager.name],
            },
            transports: logger.transports,
            level: logger.level,
        });

        this.logger = logger;
        this.loadedPlugins = [];
        this.pluginDependencyResolver = pluginDependencyResolver;
        this.orderedPlugins = [];
        this.pluginLoaders = pluginLoaders;
    }

    /**
     * Loads all plugins from the plugin loaders
     *
     * @memberof PluginManager
     */
    public async loadPlugins() {
        const pluginLoaderNames = this.pluginLoaders
            .map((pluginLoader) => pluginLoader.name)
            .join(', ');
        this.logger.debug(`Plugin loaders: ${pluginLoaderNames}`);

        for (const pluginLoader of this.pluginLoaders) {
            const loadedPlugins = await pluginLoader.loadPlugins();

            for (const loadedPlugin of loadedPlugins) {
                this.pluginDependencyResolver.addFoundPlugin(loadedPlugin);
                this.logger.debug(
                    `Added the following plugin: ${loadedPlugin.name} (${loadedPlugin.id})`,
                );
            }

            this.logger.info(
                `Loaded ${loadedPlugins.length} plugin${
                    loadedPlugins.length === 1 ? '' : 's'
                } from loader "${pluginLoader.name}"`,
            );
        }

        this.orderedPlugins = this.pluginDependencyResolver.resolvePlugins();

        this.logger.info(
            `Loaded plugins: ${this.formatPluginsDisplay(this.orderedPlugins)}`,
        );
    }

    /**
     * Formats the given IPlugin array to a string
     *
     * @private
     * @param {IPlugin[]} plugins The plugins to stringify
     * @returns {string} The stringified plugins
     * @memberof PluginManager
     */
    private formatPluginsDisplay(plugins: IPlugin[]): string {
        switch (plugins.length) {
            case 0:
                return 'No plugins found';
            case 1:
                return `1 Plugin (${this.getPluginNames(plugins)})`;
            default:
                return `${plugins.length} Plugins (${this.getPluginNames(
                    plugins,
                )})`;
        }
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

    /**
     * Returns a string representation of the given plugins
     *
     * @private
     * @param {IPlugin[]} plugins The plugins to get the strings for
     * @returns The joined string
     * @memberof PluginManager
     */
    private getPluginNames(plugins: IPlugin[]) {
        return plugins
            .map(
                (loadedPlugin) =>
                    `${loadedPlugin.id}@${loadedPlugin.version} (${loadedPlugin.name})`,
            )
            .join(', ');
    }
}
