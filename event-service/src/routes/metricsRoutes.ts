
import Router from "@koa/router";
import { Configuration } from "../config";
import MetricsController from "../controllers/metricsController";

export default function(configuration: Configuration): Router {
    const router = new Router({
        prefix: configuration.routePrefix
    });
    router.get("/health", MetricsController.pingHealth);
    return router;
}
