import { Context } from "koa";
import jsonResponse from "../util/jsonResponse";

export default {
    async pingHealth(ctx: Context) {
        jsonResponse(ctx, 200, { status: "UP" });
    }
}

