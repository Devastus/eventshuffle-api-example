import { Context } from "koa";

export default async function(ctx: Context, next: any) {
    try {
        await next();
    } catch (err) {
        ctx.status = err ?
            err.status || 500 :
            500;
        ctx.body = err ?
            err.message || "Internal server error" :
            "Internal server error";
        ctx.app.emit('error', err, ctx);
    }
}
