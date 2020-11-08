import dotenv from "dotenv";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import errorMiddleware from "./util/errorMiddleware";
import logger, { configureLogger} from "./util/logger";
import { configureDateFormatType, DateFormatType } from "./util/dateFormat";
import { getConnectionManager, ConnectionOptions } from "typeorm";

import Event from "./entities/event";
import EventDate from "./entities/eventdate";
import Vote from "./entities/vote";
import Participant from "./entities/participant";

import getEventRouter from "./routes/eventroutes";

export interface Configuration {
    appName: string,
    port: number,
    dateFormatType: DateFormatType,
    eventControllerRoute: string,
    logConsole: boolean,
    logElasticSearch: boolean,
    logLevel: string
};

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function connectDatabase() {
    let entityDir = process.env.NODE_ENV === "production" ?
        "dist/entities/**/*.js" :
        "src/entities/**/*.ts";

    const connectionOptions: ConnectionOptions = {
        name: "default",
        type: (process.env.DB_TYPE || "sqlite") as any,
        host: process.env.DB_HOST || "",
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_DATABASE || ":memory:",
        entities: [
            entityDir
            // Event, EventDate, Vote, Participant
        ],
        synchronize: (process.env.DB_SYNCHRONIZE === "true") || true,
        logging: (process.env.DB_LOGGING === "true") || false
    };

    let connManager = getConnectionManager();
    const reconnectionTries = process.env.DB_RECONNECTION_TRIES ?
        parseInt(process.env.DB_RECONNECTION_TRIES) :
        10;
    const reconnectionInterval = process.env.DB_RECONNECTION_INTERVAL ?
        parseInt(process.env.DB_RECONNECTION_INTERVAL) :
        1000;

    for (let tries = 0; tries <= reconnectionTries; tries++) {
        try {
            let conn;
            if (!connManager.has("default")){
                logger.info(`Creating new database connection of type '${connectionOptions.type}'...`);
                conn = connManager.create(connectionOptions);
            } else {
                logger.info("Using existing database connection...");
                conn = connManager.get("default");
            }

            if (!conn.isConnected) {
                logger.info("Trying to connect...");
                await conn.connect();
            }

            logger.info("Database connection succesful", {reconnectionTries: tries});
            break;
        } catch(err) {
            if (tries === reconnectionTries) {
                throw err;
            }
            logger.error(err, {reconnectionTries: tries});
            await sleep(reconnectionInterval);
        }
    }
}

export default async function(app: Koa): Promise<Configuration> {
    dotenv.config();

    // Settings
    const configuration: Configuration = {
        appName: process.env.APP_NAME || "event-service",
        port: parseInt(process.env.PORT) || 8080,
        dateFormatType: (process.env.DATE_FORMAT || "isodate") as any,
        eventControllerRoute: process.env.EVENT_CONTROLLER_ROUTE || "",
        logConsole: (process.env.LOG_CONSOLE === "true") || true,
        logElasticSearch: (process.env.LOG_ELASTIC_SEARCH === "true") || false ,
        logLevel: process.env.LOG_LEVEL || "debug",
    };

    configureLogger(configuration);
    configureDateFormatType(configuration);

    // Database
    await connectDatabase();

    // Middlewares
    app.use(bodyParser());
    app.use(errorMiddleware);
    app.on('error', (err, ctx) => {
        logger.warn(err);
    });

    // Routes
    app.use(getEventRouter(configuration).routes());

    return configuration;
}
