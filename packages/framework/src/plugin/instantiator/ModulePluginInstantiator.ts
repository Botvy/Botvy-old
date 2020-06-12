import { existsSync } from 'fs';
import { inject, injectable } from 'inversify';
import { IPluginInstantiator } from 'packages/framework/src/plugin/instantiator/IPluginInstantiator';
import { resolve } from 'path';
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
     * Contains the logger which should be used to log messages
     *
     * @private
     * @type {Logger}
     * @memberof ModulePluginInstantiator
     */
    private logger: Logger;

    /**
     * Contains the plugin description files (file or database based)
     *
     * @type {IPluginDescriptionFile[]}
     * @memberof ModulePluginInstantiator
     */
    public pluginDescriptorFiles: IPluginDescriptionFile[];

    /**
     * Creates an instance of ModulePluginInstantiator.
     * @param {Logger} logger The logger which should be used to log messages
     * @memberof ModulePluginInstantiator
     */
    constructor(@inject(ServiceConstants.System.Logger) logger: Logger) {
        this.logger = logger;
        this.pluginDescriptorFiles = [];
    }

    /**
     * Instantiates the plugins based off their entrypoint
     *
     * @returns {Promise<Plugin[]>} The loaded plugins
     * @memberof ModulePluginInstantiator
     */
    public async instantiatePlugins(): Promise<Plugin[]> {
        const result: Plugin[] = [];
        const filteredPluginDescriptorFiles = this.pluginDescriptorFiles.map(
            (pluginDescriptorFile) =>
                this.checkIfPathExists(pluginDescriptorFile.entrypoint),
        );

        if (filteredPluginDescriptorFiles.length === 0) {
            this.logger.warn(
                `No plugins left after checking if their paths exists!`,
            );

            return result;
        }

        this.logger.debug(
            `Plugin descriptor files with resolved existing paths: ${filteredPluginDescriptorFiles.length}`,
        );

        return result;
    }

    /**
     * Checks if the given path exists on the
     * file system after resolving the path
     * to a real path
     *
     * @private
     * @param {string} path The path which should be resolved and
     *                      checked if it exists on the file system
     *
     * @returns True on success. Otherwise false is returned.
     * @memberof ModulePluginInstantiator
     */
    private checkIfPathExists(path: string) {
        return existsSync(resolve(path));
    }
}
