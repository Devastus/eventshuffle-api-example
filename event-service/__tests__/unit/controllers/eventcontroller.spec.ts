import "reflect-metadata";
jest.mock("koa");
jest.mock("typeorm");
import { Context } from "koa";
import EventController from "../../../src/controllers/eventcontroller";

function mockContext(
    params: any = undefined,
    query: any = undefined,
    body: any = undefined
): any {
    return {
        params: params,
        query: query,
        body: body,
        status: undefined,
    };
}

describe("EventController", () => {
    it("should return a list of events on listEvents", async () => {
        let ctx = mockContext();
        let result = await EventController.listEvents(ctx);

        expect(ctx.status).toEqual(200);
        expect(Array.isArray(result)).toBeTruthy();
    });
});
