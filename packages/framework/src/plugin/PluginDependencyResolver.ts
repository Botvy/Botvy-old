import { injectable } from 'inversify';

import { IPlugin } from './IPlugin';

/**
 * Determines the correct order in which the plugins should be loaded
 */
@injectable()
export class PluginDependencyResolver {
    /**
     * Contains all found plugins by the plugin manager
     */
    private readonly foundPlugins: IPlugin[];

    /**
     * Contains all resolved and ordered plugins
     */
    private readonly orderedPlugins: IPlugin[];

    /**
     * Contains all plugins which are currently resolved
     */
    private resolvingPlugins: string[];

    /**
     * Constructs a new instance of the plugin dependency resolver
     */
    constructor() {
        this.foundPlugins = [];
        this.orderedPlugins = [];
        this.resolvingPlugins = [];
    }

    /**
     * Adds a new plugin to the found plugins
     *
     * @param foundPlugin The plugin to add
     */
    public addFoundPlugin(foundPlugin: IPlugin) {
        if (this.containsPlugin(this.foundPlugins, foundPlugin.id)) {
            return;
        }

        this.foundPlugins.push(foundPlugin);
    }

    /**
     * Checks if the given plugin is already in the array
     *
     * @param plugins The array to check
     * @param pluginId The id of the plugin which should be found in the array
     *
     * @return Returns true when the given plugin is in the array.
     *         Otherwise false is returned.
     */
    private containsPlugin(plugins: IPlugin[], pluginId: string) {
        return (
            plugins.find((plugin) => {
                return plugin.id === pluginId;
            }) !== undefined
        );
    }

    /**
     * Resolves the correct plugin order
     *
     * @throws Error When a dependent plugin was not found
     *
     * @return The ordered plugins
     */
    public resolvePlugins(): IPlugin[] {
        // Iterate over each found plugin
        for (const foundPlugin of this.foundPlugins) {
            // Check if the plugin was already resolved
            if (this.containsPlugin(this.orderedPlugins, foundPlugin.id)) {
                // The plugin was already resolved
                // So let us skip this entry
                continue;
            }

            // Check if the found plugin has any dependencies
            if (
                foundPlugin.dependsOn === undefined ||
                foundPlugin.dependsOn.length === 0
            ) {
                // Push the plugin to the resolved ones because it doesnt have any dependencies
                this.orderedPlugins.push(foundPlugin);
                continue;
            }

            // The found plugin has dependencies so we need to resolve them
            this.resolvePlugin(foundPlugin);
        }

        // Return the resolved and ordered plugins
        return this.orderedPlugins;
    }

    /**
     * Resolves the dependencies of the given plugin
     *
     * @param plugin The plugin to resolve the dependencies for
     */
    private resolvePlugin(plugin: IPlugin) {
        if (this.resolvingPlugins.includes(plugin.id)) {
            throw new Error(`Circular dependency found!`);
        }

        this.resolvingPlugins.push(plugin.id);

        const pluginDependencies = plugin.dependsOn;

        if (pluginDependencies === undefined) {
            return;
        }

        for (const dependentPlugin of pluginDependencies) {
            if (!this.containsPlugin(this.foundPlugins, dependentPlugin)) {
                throw new Error(
                    `The plugin with the id "${dependentPlugin}" was not found`,
                );
            }

            if (this.containsPlugin(this.orderedPlugins, dependentPlugin)) {
                continue;
            }

            // Find the dependent plugin in the found plugins
            const childPlugin = this.foundPlugins.find(
                (foundPlugin: IPlugin) => foundPlugin.id === dependentPlugin,
            );

            if (childPlugin === undefined) {
                continue;
            }

            // Check if the child plugin has any dependencies
            if (
                childPlugin.dependsOn === undefined ||
                childPlugin.dependsOn.length === 0
            ) {
                // The child plugin does not have any dependencies
                // So we can push it to the found plugins
                this.orderedPlugins.push(childPlugin);
                continue;
            }

            // Resolve the dependencies for the child plugin
            this.resolvePlugin(childPlugin);
        }

        this.orderedPlugins.push(plugin);

        this.resolvingPlugins = this.resolvingPlugins.filter(
            (resolvingPlugin) => resolvingPlugin === plugin.id,
        );
    }
}
