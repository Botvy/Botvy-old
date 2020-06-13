import { existsSync, readFileSync, writeFileSync } from 'fs';
import { inject, injectable } from 'inversify';
import { resolve } from 'path';
import { Logger } from 'winston';

import { ServiceConstants } from '../ioc/ServiceConstants';
import { IClientSettings } from './IClientSettings';

/**
 * Loads the client settings from
 *
 * @export
 * @class ClientSettingsHandler
 */
@injectable()
export class ClientSettingsHandler {
    /**
     * Contains the path to the settings file
     *
     * @private
     * @type {string}
     * @memberof ClientSettingsHandler
     */
    private settingsFilePath: string;

    /**
     * Creates an instance of ClientSettingsHandler.
     * @param {Logger} logger The logger which should be used to log messages
     * @param {string} currentWorkingDirectory The current working directory
     * @memberof ClientSettingsHandler
     */
    constructor(
        @inject(ServiceConstants.System.Logger)
        private readonly logger: Logger,
        @inject(ServiceConstants.System.CurrentWorkingDirectory)
        currentWorkingDirectory: string,
    ) {
        this.settingsFilePath = resolve(
            currentWorkingDirectory,
            'settings.json',
        );
    }

    /**
     * Loads the client settings
     *
     * @returns {IClientSettings} The loaded client settings
     * @memberof ClientSettingsHandler
     */
    public loadSettings(): IClientSettings {
        this.logger.debug(
            `Loading settings from file: ${this.settingsFilePath}`,
        );

        if (!existsSync(this.settingsFilePath)) {
            this.saveSettings({
                theme: 'white',
                activePlugins: [],
            });
        }

        const fileContents = readFileSync(this.settingsFilePath, 'utf-8');

        return JSON.parse(fileContents);
    }

    public saveSettings(settings: IClientSettings) {
        this.logger.debug('Saving client settings');

        writeFileSync(
            this.settingsFilePath,
            JSON.stringify(settings, undefined, 4),
        );

        this.logger.debug('Saved client settings');
    }
}
