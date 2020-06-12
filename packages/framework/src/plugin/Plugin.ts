import { injectable } from 'inversify';
import { Logger } from 'winston';

import { IPluginDescriptionFile } from './IPlugin';
import { IPluginAuthor } from './IPluginAuthor';

/**
 * This is the base class of all plugins
 */
@injectable()
export abstract class Plugin implements IPluginDescriptionFile {
    /**
     * Contains the plugin identifier
     *
     * The plugin identifier must start with the developer prefix
     *
     * @private
     * @type {string}
     * @memberof Plugin
     */
    private _id!: string;

    /**
     * Contains the human readable name
     *
     * @private
     * @type {string}
     * @memberof Plugin
     */
    private _name!: string;

    /**
     * Contains the version of the plugin
     *
     * This must be a compatible semver version
     *
     * @private
     * @type {string}
     * @memberof Plugin
     */
    private _version!: string;

    /**
     * Contains all plugin authors
     *
     * @private
     * @type {IPluginAuthor[]}
     * @memberof Plugin
     */
    private _authors: IPluginAuthor[] = [];

    /**
     * Contains the logger with which the messages will be logged
     *
     * @protected
     * @type {Logger}
     * @memberof Plugin
     */
    protected logger: Logger;

    /**
     * Contains the path to the entrypoint
     *
     * @private
     * @type {string}
     * @memberof Plugin
     */
    private _entrypoint!: string;

    /**
     * Contains a list of strings which points to other javascript files
     * The additional containerbinding
     *
     * @private
     * @type {(string[] | undefined)}
     * @memberof Plugin
     */
    private _additionalContainerBindings?: string[] | undefined;

    /**
     * Contains all section components which are managed by this plugin
     *
     * @private
     * @type {Record<string, unknown[]>}
     * @memberof Plugin
     */
    private _sectionComponents: Record<string, string[]>;

    /**
     * Contains all the dependencies to other plugins
     * The dependencies are defined with the plugin ids of
     * other plugins
     *
     * @private
     * @type {(string[] | undefined)}
     * @memberof Plugin
     * @example ["com.github.botvy.test-plugin"]
     */
    private _dependsOn?: string[] | undefined;

    /**
     * Creates an instance of Plugin.
     *
     * @param {Logger} logger The logger which should be used
     * @memberof Plugin
     */
    protected constructor(logger: Logger) {
        this.logger = logger;
        this._sectionComponents = {};
    }

    /**
     * Initializes the plugin
     *
     * All side effects should be executed here to make the plugin
     * runable.
     *
     * @abstract
     * @memberof Plugin
     * @example Initialize other resources or set up timers
     */
    public abstract async initialize(): Promise<void>;

    /**
     * Returns the plugin identifier
     *
     * @readonly
     * @type {string}
     * @memberof Plugin
     */
    get id(): string {
        return this._id;
    }

    /**
     * Sets the new plugin identifier
     *
     * The identifier must be prefixed with the developer prefix
     *
     * @param value The new identifier to set
     * @memberof Plugin
     */
    set id(value: string) {
        this._id = value;
    }

    /**
     * Returns the human readable name of the plugin
     *
     * @readonly
     * @type {string}
     * @memberof Plugin
     */
    get name(): string {
        return this._name;
    }

    /**
     * Sets the new human readable name
     *
     * @param value The new name to set
     * @memberof Plugin
     */
    set name(value: string) {
        this._name = value;
    }

    /**
     * Returns the semver compatible version
     *
     * @readonly
     * @type {string}
     * @memberof Plugin
     */
    get version(): string {
        return this._version;
    }

    /**
     * Sets the new semver compatible version
     *
     * @param value The new version to set
     * @memberof Plugin
     */
    set version(value: string) {
        this._version = value;
    }

    /**
     * Returns all plugin authors
     *
     * @type {IPluginAuthor[]}
     * @memberof Plugin
     */
    get authors(): IPluginAuthor[] {
        return this._authors;
    }

    /**
     * Sets the new plugin authors
     *
     * @param value The plugin authors to set
     * @memberof Plugin
     */
    set authors(newAuthors: IPluginAuthor[]) {
        this._authors = newAuthors;
    }

    /**
     * Adds a new plugin author
     *
     * @param {IPluginAuthor} author The author to add
     * @memberof Plugin
     */
    public addAuthor(author: IPluginAuthor) {
        this._authors.push(author);
    }

    /**
     * Removes a plugin author
     *
     * @param {IPluginAuthor} author The author to remove
     * @memberof Plugin
     */
    public removeAuthor(author: IPluginAuthor) {
        this._authors = this._authors.filter(
            (pluginAuthor) => pluginAuthor !== author,
        );
    }

    /**
     * Returns the file path to the plugin entrypoint
     *
     * @memberof Plugin
     */
    public get entrypoint() {
        return this._entrypoint;
    }

    /**
     *
     * Sets the new file path for the plugin entrypoint
     * @memberof Plugin
     */
    public set entrypoint(newEntrypoint: string) {
        this._entrypoint = newEntrypoint;
    }

    /**
     * Returns all additional container bindings
     * which should be loaded for this plugin
     *
     * @memberof Plugin
     */
    public get additionalContainerBindings() {
        return this._additionalContainerBindings;
    }

    /**
     * Sets the new additional container bindings
     *
     * @param {(string[] | undefined)} newContainerBindings The new bindings which should be set
     * @memberof Plugin
     */
    public set additionalContainerBindings(
        newContainerBindings: string[] | undefined,
    ) {
        this._additionalContainerBindings = newContainerBindings;
    }

    /**
     * Returns an array of plugin ids on which this plugin depends on
     *
     * @type {(string[] | undefined)}
     * @memberof Plugin
     */
    get dependsOn(): string[] | undefined {
        return this._dependsOn;
    }

    /**
     * Sets the required plugins
     *
     * @param {(string[] | undefined)} value The new array to set
     * @memberof Plugin
     */
    set dependsOn(value: string[] | undefined) {
        this._dependsOn = value;
    }

    /**
     * Returns an object with the file paths to the sections
     * and the key is the name of the section
     *
     * @type {Record<string, string[]>}
     * @memberof Plugin
     */
    get sectionComponents(): Record<string, string[]> {
        return this._sectionComponents;
    }

    /**
     * Sets the new section components
     *
     * @param {Record<string, string[]>} The new section components which should be set
     * @memberof Plugin
     */
    set sectionComponents(value: Record<string, string[]>) {
        this._sectionComponents = value;
    }

    /**
     * Maps an IPluginDescriptionFile to the properties of the instance
     *
     * @param {IPluginDescriptionFile} pluginMetadata The plugin description file
     * @memberof Plugin
     */
    public mapPluginMetadata(pluginMetadata: IPluginDescriptionFile) {
        this._id = pluginMetadata.id;
        this._name = pluginMetadata.name;
        this._version = pluginMetadata.version;
        this._authors = pluginMetadata.authors ?? [];
        this._dependsOn = pluginMetadata.dependsOn ?? [];
        this._entrypoint = pluginMetadata.entrypoint;
        this._additionalContainerBindings =
            pluginMetadata.additionalContainerBindings ?? [];
        this._sectionComponents = pluginMetadata.sectionComponents ?? {};
    }
}
