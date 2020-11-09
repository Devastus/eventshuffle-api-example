import MetricsController from "@src/controllers/metricsController";
import { mockContext } from "../../testutils/mock";

describe("MetricsController", () => {
    it("should return status in pingHealth", async (done) => {
        const ctx = mockContext();
        await MetricsController.pingHealth(ctx);
        expect(ctx.status).toEqual(200);
        expect(JSON.parse(ctx.body)).toEqual({ status: "UP" });
        done();
    });
});
