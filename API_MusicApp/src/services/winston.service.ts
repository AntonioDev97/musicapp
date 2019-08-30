import { createLogger, format, transports } from "winston";

export const logger = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
        format.prettyPrint(),
        format.printf(info => `[${info.timestamp}]${info.level} - ${info.message}`)
    ),
    'transports': [
        new transports.File({
            filename: './logs/api-logs.log',
            maxsize: 20000000,
            maxFiles: 10
        }),
        new transports.Console({
            level: 'debug'
        })
    ]
});