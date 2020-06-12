import { IPluginAuthor } from './IPluginAuthor';

/**
 * Defines the structure for a basic plugin
 */
export interface IPlugin {
    /**
     * The id of the plugin
     *
     * It must be prefixed with a vendor prefix
     */
    id: string;

    /**
     * The human readable name of the plugin
     */
    name: string;

    /**
     * The version of the plugin
     *
     * It must be semver compatible
     */
    version: string;

    /**
     * Contains a list of all plugin authors
     */
    authors?: IPluginAuthor[];

    /**
     * Contains a list of strings on which this plugin depends on
     */
    dependsOn?: string[];
}

/**
 * Defines the extended data structure for the plugin descriptor file.
 */
export interface IPluginDescriptionFile extends IPlugin {
    /**
     * Contains the path to the main entrypoint of the plugin
     *
     * The entrypoint will only be loaded in the electron main process
     * and on the server
     */
    entrypoint: string;

    /**
     * Contains an array of file paths to additional container bindings which
     * should be loaded before the plugin is required
     *
     * The container bindings will only be loaded in the electron main process
     * and on the server
     */
    additionalContainerBindings?: string[];

    /**
     * The section components will be send to the electron renderer process
     * where they get required and displayed at their specified section
     *
     * All entries in the value of the record must point to existing files
     * Each file must have a default exported React component
     */
    sectionComponents?: Record<string, string[]>;
}
