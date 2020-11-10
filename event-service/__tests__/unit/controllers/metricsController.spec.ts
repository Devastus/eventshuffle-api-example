import MetricsController from "@src/controllers/metricsController";
import { expectJsonResponse } from "../../testutils/response";
import { mockContext } from "../../testutils/mock";

describe("MetricsController", () => {
    it("should return status in pingHealth", async (done) => {
        const ctx = mockContext();
        await MetricsController.pingHealth(ctx);
        expectJsonResponse(ctx, 200, { status: "UP" });
        done();
    });
});
