import joi from 'joi';

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
    entrypoint: joi.string().required(),
    additionalContainerBindings: joi.array().items(joi.string().required()),
    sectionComponents: joi.object(),
});
