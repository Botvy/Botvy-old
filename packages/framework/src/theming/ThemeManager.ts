import { existsSync, FSWatcher, readFileSync, watch } from 'fs';
import { inject, injectable } from 'inversify';
import { resolve } from 'path';
import { Logger } from 'winston';

import { ServiceConstants } from '../ioc/ServiceConstants';
import { validateSchema } from '../schema/helper';
import { themeSchema } from '../schema/themeSchema';
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
    /**
     * Contains the resolved path to the "themes" directory
     *
     * @private
     * @type {string}
     * @memberof ThemeManager
     */
    private readonly themeDirectory: string;

    /**
     * Contains the name of the theme which is currently active
     *
     * @private
     * @type {string}
     * @memberof ThemeManager
     */
    private currentTheme: string;

    public fileChangeListener?: (...args: any[]) => void;

    /**
     * The file watcher which should be used to check for theme file changes
     *
     * @private
     * @type {FSWatcher}
     * @memberof ThemeManager
     */
    private fileWatcher?: FSWatcher;

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
        this.currentTheme = '';
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
        return existsSync(this.getResolvedThemePath(themeName));
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

        if (themeName !== this.currentTheme) {
            this.setCurrentTheme(themeName);
        }

        const fileContents = readFileSync(
            this.getResolvedThemePath(themeName),
            'utf-8',
        );
        const parsedFileContents = JSON.parse(fileContents);

        this.logger.debug(`Reading theme: ${themeName}`);

        if (!validateSchema(themeSchema, parsedFileContents, this.logger)) {
            throw new Error(`Theme file ${themeName} is not valid`);
        }

        return parsedFileContents;
    }

    private getResolvedThemePath(themeName: string): string {
        return resolve(this.themeDirectory, `${themeName}.json`);
    }

    private setCurrentTheme(themeName: string) {
        if (this.fileWatcher !== undefined) {
            this.fileWatcher.close();
        }

        this.currentTheme = themeName;

        this.fileWatcher = watch(this.getResolvedThemePath(themeName));

        if (this.fileChangeListener !== undefined) {
            this.fileWatcher.on('change', this.fileChangeListener);
        }
    }
}
