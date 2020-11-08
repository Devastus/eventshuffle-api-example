import "reflect-metadata";
import Koa from "koa";
import initConfig from "./config";
import logger from "./util/logger";

const app = new Koa();

initConfig(app).then(config => {
  app.listen(config.port);
  logger.info(`Application running on port ${config.port}`);
});

export default app;

