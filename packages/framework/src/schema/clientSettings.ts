import joi from '@hapi/joi';

export const clientSettingsSchema = joi.object({
    theme: joi.string().required().allow('white', 'dark').only(),
    activePlugins: joi.array().required().items(joi.string()),
});
