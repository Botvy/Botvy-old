import { Container, inject, injectable } from 'inversify';
import { IPluginInstantiator } from 'packages/framework/src/plugin/instantiator/IPluginInstantiator';
import { Logger } from 'winston';

import { ServiceConstants } from '../../ioc/ServiceConstants';
import { IPluginDescriptionFile } from '../IPlugin';
import { Plugin } from '../Plugin';

/**
 * The module plugin instantiator loads plugins based of their file on the filesystem
 *
 * @export
 * @class ModulePluginInstantiator
 * @implements {IPluginInstantiator}
 */
@injectable()
export class ModulePluginInstantiator implements IPluginInstantiator {
    /**
     * Creates an instance of ModulePluginInstantiator.
     * @param {Logger} logger The logger which should be used to log messages
     * @param {Container} container The container which should be used to bind the plugins into
     * @memberof ModulePluginInstantiator
     */
    constructor(
        @inject(ServiceConstants.System.Logger) private logger: Logger,
        @inject(Container) private container: Container,
    ) {
        this.logger = logger;
    }

    /**
     * Instantiates the plugins based off their entrypoint
     *
     * @param {IPluginDescriptionFile[]} pluginDescriptorFiles The array of found plugin descriptor files which should be loaded.
     * @returns {Promise<Plugin[]>} The loaded plugins
     * @memberof ModulePluginInstantiator
     */
    public async instantiatePlugins(
        pluginDescriptorFiles: IPluginDescriptionFile[],
    ): Promise<Plugin[]> {
        return Promise.all(
            pluginDescriptorFiles.map(async (pluginDescriptorFile) =>
                this.instantiatePluginFromPath(pluginDescriptorFile),
            ),
        );
    }

    /**
     * Instantiates a new Plugin from the given entrypoint
     * It requires the path and sets the plugin metadata
     * informations for it
     *
     * @private
     * @param {IPluginDescriptionFile} pluginMetadata The plugin metadata informations
     * @throws When the plugin could not be instantiated
     * @returns {Plugin} The instantiated plugin
     * @memberof DirectoryPluginLoader
     */
    private async instantiatePluginFromPath(
        pluginMetadata: IPluginDescriptionFile,
    ): Promise<Plugin> {
        await this.bindAdditionalContainerBindings(
            pluginMetadata.additionalContainerBindings ?? [],
        );

        const LoadingPlugin = this.requireDefaultExport(
            pluginMetadata.entrypoint,
        );

        this.logger.silly(
            `Binding ${LoadingPlugin.name} to ${pluginMetadata.id}`,
        );
        this.container.bind(LoadingPlugin).toSelf();
        this.logger.silly(
            `Bound ${LoadingPlugin.name} to ${pluginMetadata.id}`,
        );

        this.logger.debug(`Trying to instantiate the plugin`);
        const instance: Plugin = this.container.get<Plugin>(LoadingPlugin);
        instance.mapPluginMetadata(pluginMetadata);

        this.logger.debug(`Plugin instantiated`);

        return instance;
    }

    /**
     * Binds the given container bindings to the container
     *
     * @private
     * @param {string[]} additionalContainerBindings The container bindings which should be bound
     * @memberof ModulePluginInstantiator
     */
    private async bindAdditionalContainerBindings(
        additionalContainerBindings: string[],
    ) {
        for (const containerBinding of additionalContainerBindings) {
            this.logger.silly(
                `Loading container bindings: ${containerBinding}`,
            );
            const defaultExport = this.requireDefaultExport(containerBinding);

            await this.container.loadAsync(new defaultExport());
            this.logger.debug(`Bound ${defaultExport.name} to the container`);
        }
    }

    /**
     * Requires a file and returns the default export.
     * An error will be thrown when the default export does not exists.
     *
     * @private
     * @param {string} file The file to load
     * @returns The default export of the file
     * @memberof ModulePluginInstantiator
     */
    private requireDefaultExport(file: string) {
        const requiredFile = require(file);

        if (requiredFile.default === undefined) {
            throw new Error(`File "${file}" has no default export`);
        }

        return requiredFile.default;
    }
}
