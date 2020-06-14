import joi from '@hapi/joi';

import { webColors } from './utils/WebColors';

/**
 * Checks the given value if it is a web or hex color
 *
 * @param value The value to check
 */
const colorValidator = (value: string) => {
    // Check if the given value is a known web color
    if (webColors.includes(value.toLowerCase())) {
        return value.toLowerCase();
    }

    // Check if the value starts with a "#"
    if (!value.startsWith('#')) {
        // The value starts not with a "#" so its not a hex color
        throw new Error(
            `The value "${value}" does not start with a "#" or is not a valid web color`,
        );
    }

    const hexColor = value.substr(1);

    // Check if the hex color has 3 or 6 characters
    // Anything else is not a valid hex color
    if (hexColor.length !== 3 && hexColor.length !== 6) {
        throw new Error(`The value "${value}" must have 3 or 6 characters`);
    }

    const hexRegex = /[0-9A-Fa-f]/;

    // Check if the value is a valid hexadecimal string
    if (hexRegex.test(value)) {
        return value;
    }

    throw new Error(
        `The value "${value}" is not a valid web color or a hex string`,
    );
};

/**
 * Describes the schema of a theming file
 */
export const themeSchema = joi.object({
    color: joi.object({
        background: joi.custom(colorValidator).required(),
        foreground: joi.custom(colorValidator).required(),
        error: joi.custom(colorValidator).required(),
    }),
});
