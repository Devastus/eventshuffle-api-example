export function expectJsonResponse(ctx: any, expectedStatus: number, expectedValue: any) {
    expect(ctx.status).toEqual(expectedStatus);
    expect(ctx.headers["Content-Type"]).toEqual("application/json");
    expect(typeof ctx.body).toEqual("string");
    expect(JSON.parse(ctx.body)).toEqual(expectedValue);
}

export async function expectErrorResponse(func: Promise<any>, expectedErrorStatus: number) {
    try {
        await func;
        fail("No error was thrown");
    } catch (err) {
        expect(err.status).toEqual(expectedErrorStatus);
    }
}
