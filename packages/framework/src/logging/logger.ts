import { createLogger, format, transports } from 'winston';

const ConsoleTransport = new transports.Console();

export const logger = createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    transports: [
        ConsoleTransport,
    ],
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: 'DD.MM.YYYY HH:mm:ss',
        }),
        format.printf(({ timestamp, level, message, ...rest }) => {
            return `[${timestamp}] [${level}]: ${message}`;
        }),
    ),
});
