import { mockContext } from "../../testutils/mock";
import errorMiddleware from "@src/util/errorMiddleware";

describe("errorMiddleware", () => {
    it("should populate ctx with error if a middleware function throws", async (done) => {
        const ctx: any = mockContext();
        await errorMiddleware(ctx, async () => { throw { status: 400, message: "Error" }; });
        expect(ctx.status).toEqual(400);
        expect(ctx.body).toEqual("Error");
        expect(ctx.app.emit).toBeCalled();

        await errorMiddleware(ctx, async () => { throw undefined; });
        expect(ctx.status).toEqual(500);
        expect(ctx.body).toEqual("Internal server error");
        expect(ctx.app.emit).toBeCalled();

        done();
    });
});
