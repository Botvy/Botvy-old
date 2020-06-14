import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { inject, injectable } from 'inversify';
import { resolve } from 'path';
import { Logger } from 'winston';

import { ServiceConstants } from '../../ioc/ServiceConstants';
import { validateSchema } from '../../schema/helper';
import { pluginDescriptorSchema } from '../../schema/pluginDescriptor';
import { IPlugin, IPluginDescriptionFile } from '../IPlugin';
import { IPluginLoader } from './IPluginLoader';

/**
 * The directory plugin loader is a directory based loader
 * which loads plugins from a specific directory
 *
 * @export
 * @class DirectoryPluginLoader
 * @implements {IPluginLoader}
 */
@injectable()
export class DirectoryPluginLoader implements IPluginLoader {
    /**
     * Contains the human readable name
     */
    public readonly name: string;

    /**
     * The logger which will be used to log messages
     */
    private readonly logger: Logger;

    /**
     * Contains the path to the directory where the plugins are located
     *
     * @private
     * @type {string}
     * @memberof DirectoryPluginLoader
     */
    private readonly directoryPath: string;

    /**
     * Creates an instance of DirectoryPluginLoader.
     * @param {Logger} logger The logger which should be used to log messages
     * @param {string} directoryPath The path to the directory where the plugins are located
     * @memberof DirectoryPluginLoader
     */
    constructor(
        @inject(ServiceConstants.System.Logger) logger: Logger,
        @inject(
            ServiceConstants.System.Plugin.Loader.DirectoryLoader.directoryPath,
        )
        directoryPath: string,
    ) {
        this.name = 'Directory plugin loader';
        this.logger = logger;
        this.directoryPath = directoryPath;
    }

    /**
     * Loads the plugins from the directory
     *
     * @returns {Promise<IPluginDescriptionFile[]>} The loaded plugins
     * @memberof DirectoryPluginLoader
     */
    public async loadPlugins(): Promise<IPlugin[]> {
        const pluginsPath = resolve(process.cwd(), this.directoryPath);

        const result: IPlugin[] = [];

        this.logger.debug(`Plugins directory: ${pluginsPath}`);

        this.checkDirectoryPath();

        const directoryContents = readdirSync(this.directoryPath, {
            encoding: 'utf8',
        });

        if (directoryContents.length === 0) {
            this.logger.warn(
                `The directory ${pluginsPath} does not contain any plugins`,
            );

            return result;
        }

        this.logger.silly(
            `Directory contents: ${directoryContents.join(', ')}`,
        );

        if (directoryContents.length === 0) {
            this.logger.warn(`DirectoryLoader: The plugin directory is empty`);
            return result;
        }

        for (const directory of directoryContents) {
            const pluginDirectory = resolve(this.directoryPath, directory);
            const pluginDescriptorFile = resolve(
                pluginDirectory,
                'plugin.json',
            );

            if (!existsSync(pluginDescriptorFile)) {
                this.logger.warn(
                    `The directory ${pluginDirectory} does not contain a "plugin.json" file`,
                );
                continue;
            }

            this.logger.debug('Reading plugin descriptor file contents');

            const pluginDescriptorFileContents = readFileSync(
                pluginDescriptorFile,
                {
                    encoding: 'utf8',
                },
            );

            this.logger.silly(
                `Read file contents of file: ${pluginDescriptorFile}`,
            );

            const parsedPluginDescriptor = JSON.parse(
                pluginDescriptorFileContents,
            ) as IPluginDescriptionFile;

            this.logger.silly(
                `Parsed JSON structure: ${JSON.stringify(
                    parsedPluginDescriptor,
                )}`,
            );

            this.logger.debug('Validating the schema');

            if (
                !validateSchema(
                    pluginDescriptorSchema,
                    parsedPluginDescriptor,
                    this.logger,
                )
            ) {
                this.logger.error(
                    `The plugin.json in the directory "${pluginDirectory}" is not valid`,
                );
                continue;
            }

            const { id: pluginId } = parsedPluginDescriptor;

            this.remapDirectories(parsedPluginDescriptor, pluginDirectory);

            if (
                !parsedPluginDescriptor.entrypoint.startsWith(pluginDirectory)
            ) {
                this.logger.error(
                    `The entrypoint for plugin ${pluginId} is outside of the plugin directory`,
                );
                continue;
            }

            if (
                parsedPluginDescriptor.additionalContainerBindings!.some(
                    (file) => {
                        return !file.startsWith(pluginDirectory);
                    },
                )
            ) {
                this.logger.error(
                    `One or more container bindings for plugin ${pluginId} are outside of the plugin directory`,
                );
                continue;
            }

            if (
                Object.keys(parsedPluginDescriptor.sectionComponents!)
                    .reduce((acc, key) => {
                        return [
                            ...acc,
                            ...parsedPluginDescriptor.sectionComponents![key],
                        ];
                    }, [] as string[])
                    .some((file) => !file.startsWith(pluginDirectory))
            ) {
                this.logger.error(
                    `One or more section components for plugin ${pluginId} are outside of the plugin directory`,
                );
                continue;
            }

            if (!existsSync(parsedPluginDescriptor.entrypoint)) {
                this.logger.error(
                    `The entrypoint does not exists: ${parsedPluginDescriptor.entrypoint}`,
                );
                continue;
            }

            this.logger.silly(`Validated plugin schema for plugin ${pluginId}`);

            result.push(parsedPluginDescriptor);

            this.logger.info(`Found plugin: ${pluginId}`);
        }

        return result;
    }

    /**
     * Checks if the plugin directory exists.
     * The function tries to create the directory when it not exists.
     *
     * @memberof DirectoryPluginLoader
     */
    checkDirectoryPath() {
        const resolvedPath = resolve(this.directoryPath);

        if (!existsSync(resolvedPath)) {
            this.logger.debug(
                `"${resolvedPath}" is not a directory. Trying to create it`,
            );

            const createdDirectory = mkdirSync(resolvedPath);

            if (createdDirectory !== undefined) {
                throw new Error(`Could not create directory: ${resolvedPath}`);
            }

            this.logger.info(`Created plugin directory: ${resolvedPath}`);
        }
    }

    /**
     * Remaps the file paths of the given plugin descriptor to be based of the plugin directory
     *
     * @private
     * @param {IPluginDescriptionFile} pluginDescriptor The plugin descriptor file which should be modified
     * @param {string} pluginDirectory The path to the plugin directory
     * @memberof DirectoryPluginLoader
     */
    private remapDirectories(
        pluginDescriptor: IPluginDescriptionFile,
        pluginDirectory: string,
    ) {
        this.logger.silly(
            `Remapping entrypoint for plugin: ${pluginDescriptor.id}`,
        );
        pluginDescriptor.entrypoint = resolve(
            pluginDirectory,
            pluginDescriptor.entrypoint,
        );
        this.logger.silly(
            `Remapped entrypoint for plugin: ${pluginDescriptor.id}`,
        );

        this.logger.silly(
            `Remapping container bindings for plugin: ${pluginDescriptor.id}`,
        );
        pluginDescriptor.additionalContainerBindings = (
            pluginDescriptor.additionalContainerBindings ?? []
        ).map((file) => {
            return resolve(pluginDirectory, file);
        });
        this.logger.silly(
            `Remapped container bindings for plugin: ${pluginDescriptor.id}`,
        );

        this.logger.silly(
            `Remapping section components for plugin: ${pluginDescriptor.id}`,
        );
        pluginDescriptor.sectionComponents = Object.keys(
            pluginDescriptor.sectionComponents ?? {},
        ).reduce(
            (acc, key) => ({
                ...acc,
                [key]: pluginDescriptor.sectionComponents![key].map((file) => {
                    return resolve(pluginDirectory, file);
                }),
            }),
            {} as Record<string, string[]>,
        );
        this.logger.silly(
            `Remapped section components for plugin: ${pluginDescriptor.id}`,
        );
    }
}
