import { validateSchema } from '@botvy/framework/dist/schema/helper';
import { themeSchema } from '@botvy/framework/dist/schema/themeSchema';
import { existsSync, readFileSync } from 'fs';
import { inject, injectable } from 'inversify';
import { resolve } from 'path';
import { Logger } from 'winston';

import { ServiceConstants } from '../ioc/ServiceConstants';
import { ITheme } from './ITheme';

/**
 * The theme manager can be used to check if a specific theme exists
 * and loading a specific theme
 *
 * @export
 * @class ThemeManager
 */
@injectable()
export class ThemeManager {
    private themeDirectory: string;

    /**
     * Creates an instance of ThemeManager.
     * @param {string} cwd The current working directory
     * @memberof ThemeManager
     */
    constructor(
        @inject(ServiceConstants.System.Logger)
        private readonly logger: Logger,
        @inject(ServiceConstants.System.CurrentWorkingDirectory) cwd: string,
    ) {
        this.themeDirectory = resolve(cwd, 'themes');
    }

    /**
     * Checks if a theme with the given name exists
     *
     * @private
     * @param {string} themeName The name of the theme
     * @returns {boolean} True when the theme exists. Otherwise false.
     * @memberof ClientSettingsHandler
     */
    public checkIfThemeExists(themeName: string): boolean {
        this.logger.debug(`Checking if theme "${themeName}" exists`);
        return existsSync(resolve(this.themeDirectory, `${themeName}.json`));
    }

    /**
     * Loads the theme with the given name
     *
     * @param {string} themeName The name of the theme to load
     * @returns {ITheme} The loaded theme
     * @memberof ThemeManager
     */
    public loadTheme(themeName: string): ITheme {
        if (!this.checkIfThemeExists(themeName)) {
            throw new Error(`Could not find theme: ${themeName}`);
        }

        const fileContents = readFileSync(
            resolve(this.themeDirectory, `${themeName}.json`),
            'utf-8',
        );
        const parsedFileContents = JSON.parse(fileContents);

        this.logger.debug(`Reading theme: ${themeName}`);

        if (!validateSchema(themeSchema, parsedFileContents, this.logger)) {
            throw new Error(`Theme file ${themeName} is not valid`);
        }

        return parsedFileContents;
    }
}
