import { injectable } from 'inversify';
import joi from 'joi';

/**
 * The schema validator runs a given schema against the given input
 *
 * @export
 * @class SchemaValidator
 * @template T The type to expect
 */
@injectable()
export class SchemaValidator {
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
    public async validateSchema<T>(schema: joi.Schema, input: T): Promise<T> {
        let result: T;

        try {
            result = await schema.validate<T>(input);
        } catch (error) {
            throw new Error(`Invalid input`);
        }

        return result;
    }
}
