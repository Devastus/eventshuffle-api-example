import { mockContext } from "../../testutils/mock";
import getEventRouter from "@src/routes/eventRoutes";
jest.mock("@src/controllers/eventController");
import EventController from "@src/controllers/eventController";

describe("getEventRouter", () => {
    it("should contain all expected routes with expected functions", async (done) => {
        const ctx: any = mockContext();
        const expectedOutput: any = [
            {
                path: "/list",
                method: EventController.listEvents
            },
            {
                path: "/:id",
                method: EventController.getEvent
            },
            {
                path: "/:id/results",
                method: EventController.getEventResults
            },
            {
                path: "/:id/vote",
                method: EventController.insertVote
            },
            {
                path: "/",
                method: EventController.insertEvent
            },
        ]
        const router: any = getEventRouter({ routePrefix: "" } as any);
        for (let i = 0; i < expectedOutput.length; i++) {
            const expected = expectedOutput[i];
            const layer = router.stack.find((l: any) => l.path === expected.path);
            expect(layer).toBeDefined();
            await layer.stack[0](ctx);
            expect(expected.method).toBeCalled();
        }
        done();
    });
});
