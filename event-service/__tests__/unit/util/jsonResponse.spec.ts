import jsonResponse from "@src/util/jsonResponse";
import { expectJsonResponse } from "../../testutils/response";
import { mockContext } from "../../testutils/mock";

describe("jsonResponse", () => {
    it("should set ctx to a json response format", (done) => {
       let ctx: any = mockContext();
       let testBody: any = {test: true};
       jsonResponse(ctx, 200, testBody);
       expectJsonResponse(ctx, 200, testBody);

       ctx = mockContext();
       testBody = {something: "A test value"};
       jsonResponse(ctx, 404, testBody);
       expectJsonResponse(ctx, 404, testBody);

       done();
    });
})
