import { ContainerModule } from 'inversify';
import { createLogger, format, transports } from 'winston';

import { ServiceConstants } from '../../ioc/ServiceConstants';

/**
 * Defines the logger container modules
 * This binds all logger related stuff to the container
 *
 * @export
 * @class LoggerContainerModule
 * @extends {ContainerModule}
 */
export class LoggerContainerModule extends ContainerModule {
    /**
     * Creates an instance of LoggerContainerModule.
     * @memberof LoggerContainerModule
     */
    constructor() {
        super((bind) => {
            bind(ServiceConstants.System.Logger).toDynamicValue(
                ({ container }) =>
                    createLogger({
                        level: process.env.LOG_LEVEL ?? 'info',
                        transports: container.getAll(
                            ServiceConstants.System.LoggerOptions.Transports,
                        ),
                        format: format.combine(...container.getAll(format)),
                    }),
            );

            // Bind the formatters
            bind(format).toConstantValue(format.colorize());
            bind(format).toConstantValue(
                format.timestamp({
                    format: 'DD.MM.YYYY HH:mm:ss',
                }),
            );
            bind(format).toConstantValue(
                format.printf(({ timestamp, level, message, tags }) => {
                    return `[${timestamp}] [${level}]${this.getFormattedTags(
                        tags,
                        '] [',
                        '[',
                        ']',
                    )}: ${message}`;
                }),
            );

            // Bind the transports
            bind(
                ServiceConstants.System.LoggerOptions.Transports,
            ).toConstantValue(new transports.Console());
        });
    }

    /**
     * Returns a stringified version of the tags
     *
     * @private
     * @param {string[]} tags The tags to stringify
     * @returns {string} The stringified tags
     * @memberof LoggerContainerModule
     */
    private getFormattedTags(
        tags: string[],
        joinSeparator: string,
        prefix = '',
        suffix = '',
    ): string {
        let result = '';

        if (tags === undefined || tags.length === 0) {
            return result;
        }

        result += ` ${prefix}`;
        result += tags.join(joinSeparator);
        result += `${suffix}`;

        return result;
    }
}
