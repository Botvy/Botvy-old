import joi from '@hapi/joi';
import { Logger } from 'winston';

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
export const validateSchema = <T>(
    schema: joi.Schema,
    input: T,
    logger: Logger,
): input is T => {
    const validationError = schema.validate(input).error;

    if (validationError === undefined) {
        return true;
    }

    logger.error(validationError.message);

    return false;
};
