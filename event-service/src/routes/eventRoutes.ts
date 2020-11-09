import Router from "@koa/router";
import { Configuration } from "../config";
import EventController from "../controllers/eventController";

export default function(configuration: Configuration): Router {
    const router = new Router({
        prefix: configuration.routePrefix
    });
    router.get("/list", EventController.listEvents);
    router.get("/:id", EventController.getEvent);
    router.get("/:id/results", EventController.getEventResults);
    router.post("/:id/vote", EventController.insertVote);
    router.post("/", EventController.insertEvent);
    return router;
}
