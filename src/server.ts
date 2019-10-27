import * as errorHandler from "errorhandler";
import * as express from "express";
import * as http from "http";
import { getLogger } from "log4js";
const logger = getLogger("server");

const app: express.Express = require("./app");

/**
 * Error Handler. Provides full stack - remove for production
 */
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = http.createServer(app);

server.listen(app.get("port"), () => {
  logger.info(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  logger.info("  Press CTRL-C to stop\n");
});


export = server;