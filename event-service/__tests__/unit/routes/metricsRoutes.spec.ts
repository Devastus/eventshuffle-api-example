import { mockContext } from "../../testutils/mock";
import getMetricsRouter from "@src/routes/metricsRoutes";
jest.mock("@src/controllers/metricsController");
import MetricsController from "@src/controllers/metricsController";

describe("getMetricsRouter", () => {
    it("should contain all expected routes with expected functions", async (done) => {
        const ctx: any = mockContext();
        const expectedOutput: any = [
            {
                path: "/health",
                method: MetricsController.pingHealth
            },
        ]
        const router: any = getMetricsRouter({ routePrefix: "" } as any);
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
