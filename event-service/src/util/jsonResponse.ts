import { Context } from "koa";

export default function(ctx: Context, status: number, body: any) {
    ctx.status = status;
    ctx.set("Content-Type", "application/json");
    ctx.body = JSON.stringify(body);
}
