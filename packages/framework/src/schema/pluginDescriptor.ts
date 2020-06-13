import joi from '@hapi/joi';

/**
 * Checks if the path starts with ".."
 *
 * @param path The path which should be checked
 */
export const isInPluginDirectory = (path: string) =>
    path.includes('..') === false;

/**
 * Validates the given value to be inside the plugin directory
 *
 * @param value The value which should be validated
 */
const pathValidatorFunction = (value: string): string => {
    if (!isInPluginDirectory(value)) {
        throw new Error('The entrypoint must be in the plugin directory');
    }

    return value;
};

/**
 * Defines the schema for the IPluginDescriptionFile
 */
export const pluginDescriptorSchema = joi.object({
    id: joi.string().required(),
    name: joi.string().required(),
    version: joi
        .string()
        .required()
        .regex(/\d+\.\d+\.\d+/),
    authors: joi.array().items(
        joi.object({
            name: joi.string().required(),
            website: joi.string().uri(),
            email: joi.string().email(),
        }),
    ),
    dependsOn: joi.array().items(joi.string().required()),
    entrypoint: joi.string().custom(pathValidatorFunction).required(),
    additionalContainerBindings: joi
        .array()
        .items(joi.string().custom(pathValidatorFunction).required()),
    sectionComponents: joi
        .object()
        .custom((value: Record<string, string[]>) => {
            for (const key in Object.keys(value)) {
                const objectValue = value[key];

                for (const entry in objectValue) {
                    if (isInPluginDirectory(entry)) {
                        continue;
                    }

                    throw new Error(
                        'The section components must be inside the plugin directory',
                    );
                }
            }

            return value;
        }),
});
