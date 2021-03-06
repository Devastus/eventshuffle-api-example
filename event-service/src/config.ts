import dotenv from "dotenv";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import errorMiddleware from "./util/errorMiddleware";
import * as swagger from "swagger2";
import { ui as swaggerUi } from "swagger2-koa";
import logger, { configureLogger} from "./util/logger";
import { configureDateFormatType, DateFormatType } from "./util/dateFormat";
import { getConnectionManager, ConnectionOptions } from "typeorm";

import getEventRouter from "./routes/eventRoutes";
import getMetricsRouter from "./routes/metricsRoutes";

export interface Configuration {
    appName: string,
    port: number,
    dateFormatType: DateFormatType,
    routePrefix: string,
    logLevel: string
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function connectDatabase() {
    const entityDir = process.env.NODE_ENV === "production" ?
        "dist/entities/**/*.js" :
        "src/entities/**/*.ts";

    const connectionOptions: ConnectionOptions = {
        name: "default",
        type: (process.env.DB_TYPE || "sqlite") as any,
        host: process.env.DB_HOST || "",
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_DATABASE || ":memory:",
        entities: [
            entityDir
        ],
        synchronize: (process.env.DB_SYNCHRONIZE === "true") || true,
        logging: (process.env.DB_LOGGING === "true") || false
    };

    const connManager = getConnectionManager();
    const reconnectionTries = process.env.DB_RECONNECTION_TRIES ?
        parseInt(process.env.DB_RECONNECTION_TRIES, 10) :
        10;
    const reconnectionInterval = process.env.DB_RECONNECTION_INTERVAL ?
        parseInt(process.env.DB_RECONNECTION_INTERVAL, 10) :
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
        routePrefix: process.env.ROUTE_PREFIX !== undefined ?
            process.env.ROUTE_PREFIX :
            "/api/v1/event",
        logLevel: process.env.LOG_LEVEL || "debug",
    };

    configureLogger(configuration);
    configureDateFormatType(configuration);

    // Database
    await connectDatabase();

    // Middlewares
    app.use(bodyParser());
    app.use(errorMiddleware);
    app.on('error', (err) => {
        logger.warn(err);
    });

    const swaggerDocument: any = swagger.loadDocumentSync("./swagger.yml");

    // Routes
    app.use(swaggerUi(swaggerDocument, `${configuration.routePrefix}/swagger`));
    app.use(getMetricsRouter(configuration).routes());
    app.use(getEventRouter(configuration).routes());

    return configuration;
}
