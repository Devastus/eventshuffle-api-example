import { Context } from "koa";

export default async function(ctx: Context, next: any) {
    try {
        await next();
    } catch (err) {
        const status = err.status | 500;
        ctx.status = status;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
}
