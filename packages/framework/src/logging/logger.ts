import { createLogger, format, Logger, transports } from 'winston';

const ConsoleTransport = new transports.Console();

export const logger = createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    transports: [ConsoleTransport],
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: 'DD.MM.YYYY HH:mm:ss',
        }),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] [${level}]: ${message}`;
        }),
    ),
});

/**
 * Configures the given logger and sets the name as tag.
 * The tag will be used by the logger to show from which
 * class the messages are coming from.
 *
 * @param logger The logger which should be configured
 * @param name The name of the class which uses the logger
 */
export const configureLogger = (logger: Logger, name: string) => {
    logger.configure({
        defaultMeta: {
            tags: [name],
        },
        level: logger.level,
        transports: logger.transports,
    });
};
