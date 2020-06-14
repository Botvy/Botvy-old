import { validateSchema } from '@botvy/framework/dist/schema/helper';
import { themeSchema } from '@botvy/framework/dist/schema/themeSchema';
import { ITheme } from '@botvy/framework/dist/theming/ITheme';
import { readdirSync, readFileSync } from 'fs';
import { basename, resolve } from 'path';
import { Logger } from 'winston';

describe('Themes', () => {
    const logger = jest.genMockFromModule('winston');
    const themesDirectory = resolve(__dirname, '..', '..', 'themes');
    const directoryContents = readdirSync(themesDirectory, {
        encoding: 'utf-8',
    });

    const readThemes = directoryContents.reduce((acc, entry) => {
        const themeName = basename(entry, '.json');

        return {
            ...acc,
            [themeName]: JSON.parse(
                readFileSync(resolve(themesDirectory, entry), 'utf-8'),
            ),
        };
    }, {} as Record<string, ITheme>);

    Object.keys(readThemes).forEach((themeName) => {
        it(`${themeName} must be validatable against the theme schema`, () => {
            expect(
                validateSchema<ITheme>(
                    themeSchema,
                    readThemes[themeName],
                    (logger as unknown) as Logger,
                ),
            ).toBe(true);
        });
    });
});
