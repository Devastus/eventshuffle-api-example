import winston from "winston";
import { Configuration } from "../config";

let logger: any;

function consoleFormat(configuration: Configuration) {
    return winston.format.printf(({timestamp, level, message, metadata}) => {
        const metadataString = Object.keys(metadata).length > 0 ?
            ` | ${JSON.stringify(metadata)}` :
            "";
        return `[${timestamp}][${configuration.appName}][${level}] ${message}${metadataString}`;
    });
}

export function configureLogger(configuration: Configuration) {
    const transports = [];
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.metadata({fillExcept: ["timestamp", "level", "service", "message"]}),
                winston.format.colorize(),
                consoleFormat(configuration)
            )
        })
    );

    logger = winston.createLogger({
        level: configuration.logLevel,
        defaultMeta: { service: configuration.appName },
        transports: transports
    });
}

export default {
    debug(log: any, metadata?: any) {
        logger.debug(log, metadata);
    },
    info(log: any, metadata?: any) {
        logger.info(log, metadata);
    },
    warn(log: any, metadata?: any) {
        logger.warn(log, metadata);
    },
    error(log: any, metadata?: any) {
        logger.error(log, metadata);
    },
    log(level: string, log: any, metadata?: any) {
        const metadataObject: any = {};
        if (metadata) metadataObject.metadata = metadata;
        logger[level](log, metadataObject);
    },
};
