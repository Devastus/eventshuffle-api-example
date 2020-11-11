jest.mock("dotenv");
jest.mock("koa");
jest.mock("koa-bodyparser");
jest.mock("swagger2");
jest.mock("swagger2-koa");
import Koa from "koa";
import typeorm = require("typeorm");
import initConfiguration from "@src/config";

typeorm.getConnectionManager = jest.fn().mockReturnValue({
    create: jest.fn().mockReturnValue({
        isConnected: false,
        connect: jest.fn().mockResolvedValue(undefined)
    }),
    has: jest.fn().mockReturnValue(false)
});

describe("Configuration", () => {
    it("should return a Configuration object without env variables", async (done) => {
        const app = new Koa();
        const expectedOutput: any = {
            appName: "event-service",
            port: 8080,
            dateFormatType: "isodate",
            routePrefix: "/api/v1/event",
            logLevel: "debug"
        };
        const config = await initConfiguration(app);
        expect(typeorm.getConnectionManager).toBeCalled();
        expect(typeorm.getConnectionManager().create).toBeCalled();
        expect(typeorm.getConnectionManager().has).toBeCalled();
        expect(config).toEqual(expectedOutput);
        done();
    });

    it("should return a Configuration object based on env variables", async (done) => {
        const app = new Koa();
        const expectedOutput: any = {
            appName: "testApp",
            port: 3000,
            dateFormatType: "unix",
            routePrefix: "",
            logLevel: "warn"
        };
        process.env.APP_NAME = String(expectedOutput.appName);
        process.env.PORT = String(expectedOutput.port);
        process.env.DATE_FORMAT = String(expectedOutput.dateFormatType);
        process.env.ROUTE_PREFIX = String(expectedOutput.routePrefix);
        process.env.LOG_LEVEL = String(expectedOutput.logLevel);

        const config = await initConfiguration(app);
        expect(typeorm.getConnectionManager).toBeCalled();
        expect(typeorm.getConnectionManager().create).toBeCalled();
        expect(typeorm.getConnectionManager().has).toBeCalled();
        expect(config).toEqual(expectedOutput);
        done();
    });
});
