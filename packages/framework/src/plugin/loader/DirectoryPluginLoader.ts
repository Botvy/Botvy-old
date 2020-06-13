import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { Container, inject, injectable } from 'inversify';
import { resolve } from 'path';
import { Logger } from 'winston';

import { ServiceConstants } from '../../ioc/ServiceConstants';
import { validateSchema } from '../../schema/helper';
import { pluginDescriptorSchema } from '../../schema/pluginDescriptor';
import { IPlugin, IPluginDescriptionFile } from '../IPlugin';
import { IPluginAuthor } from '../IPluginAuthor';
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
     * Contains the dependency injection container
     *
     * @private
     * @type {Container}
     * @memberof DirectoryPluginLoader
     */
    private readonly container: Container;

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
     * @param {SchemaValidator<IPluginDescriptionFile>} schemaValidator The schema validator for the plugin.json file
     * @memberof DirectoryPluginLoader
     */
    constructor(
        @inject(ServiceConstants.System.Logger) logger: Logger,
        @inject(Container) container: Container,
        @inject(
            ServiceConstants.System.Plugin.Loader.DirectoryLoader.directoryPath,
        )
        directoryPath: string,
    ) {
        this.name = 'Directory plugin loader';
        this.logger = logger;
        this.container = container;
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

            const resolvePath = (path: string) =>
                resolve(pluginDirectory, path);

            this.logger.silly('Validating the schema');

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
            this.logger.silly('Validated the schema');

            this.logger.silly(
                `Validated plugin file: ${JSON.stringify(
                    pluginDescriptorFile,
                    undefined,
                    4,
                )}`,
            );

            this.logger.silly(`Remapping the additional container bindings`);

            parsedPluginDescriptor.additionalContainerBindings = (
                parsedPluginDescriptor.additionalContainerBindings ?? []
            ).map((containerBinding) => resolvePath(containerBinding));

            this.logger.silly(
                `Remapped the additional container bindings: ${JSON.stringify(
                    parsedPluginDescriptor.additionalContainerBindings,
                    undefined,
                    4,
                )}`,
            );

            if (parsedPluginDescriptor.sectionComponents !== undefined) {
                parsedPluginDescriptor.sectionComponents = Object.keys(
                    parsedPluginDescriptor.sectionComponents,
                ).reduce((acc, key) => {
                    if (
                        parsedPluginDescriptor.sectionComponents === undefined
                    ) {
                        return acc;
                    }

                    const sectionComponents =
                        parsedPluginDescriptor.sectionComponents ?? [];

                    this.logger.debug(
                        `Section components: ${sectionComponents}`,
                    );

                    return {
                        ...acc,
                        [key]: (
                            parsedPluginDescriptor.sectionComponents[key] ?? []
                        ).map((componentPath) =>
                            resolvePath(componentPath as string),
                        ),
                    };
                }, {} as Record<string, string[]>);

                this.logger.silly(
                    `Remapped the section components: ${JSON.stringify(
                        parsedPluginDescriptor.sectionComponents,
                        undefined,
                        4,
                    )}`,
                );
            }

            const { id: pluginId, entrypoint } = parsedPluginDescriptor;

            parsedPluginDescriptor.entrypoint = resolve(
                pluginDirectory,
                entrypoint,
            );

            this.logger.silly(
                `Resolved entrypoint: ${parsedPluginDescriptor.entrypoint}`,
            );

            if (
                !parsedPluginDescriptor.entrypoint.startsWith(pluginDirectory)
            ) {
                this.logger.error(
                    `The entrypoint for plugin ${pluginId} is outside of the plugin directory`,
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

    getFormattedAuthors(authors: IPluginAuthor[]) {
        return authors
            .map((author) =>
                [
                    author.name,
                    author.email !== undefined && author.email.length > 0
                        ? `<${author.email}>`
                        : '',
                    author.website !== undefined && author.website.length > 0
                        ? `(${author.website})`
                        : '',
                ]
                    .filter((entry) => entry.length > 0)
                    .join(' '),
            )
            .join(', ');
    }

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
}
