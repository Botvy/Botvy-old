import joi from '@hapi/joi';

/**
 * Validates the given input against the given schema and returns a hydrated
 *
 * object of the input. It will throw an error when the input is not valid.
 * @template T
 * @param {joi.Schema} schema The schema to check the input against
 * @param {T} input The input which should be validated
 * @returns {Promise<T>} The object with the mapped values from the input
 * @throws {Error} When the input could not be validated against the schema
 * @memberof SchemaValidator
 */
export const validateSchema = <T>(schema: joi.Schema, input: T): input is T => {
    return schema.validate(input).errors === undefined;
};
