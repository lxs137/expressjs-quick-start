import * as express from "express";
import { Response, Request, NextFunction } from "express";
import * as compression from "compression";  // compresses requests
import * as bodyParser from "body-parser";
import * as path from "path";
import * as mung from "express-mung";
import * as log4js from "log4js";
import indexRouter from "routes/index";

// Init logger
log4js.configure({
  appenders: {
    console: { type: "console" },
    file: {
      type: "file",
      filename: "logs/server.log",
      maxLogSize: 1009715200, // 100MB
      backups: 3,
      compress: true
    }
  },
  categories: {
    default: { appenders: ["file", "console"], level: "info" }
  }
});
const logger = log4js.getLogger("express");

const app = express();

// Config for app
app.set("port", process.env.PORT || 3000);

// uncomment after placing your favicon in /public
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  app.use(log4js.connectLogger(logger, <any>{
    level: "auto",
    format: (req: Request, res: Response, fmtFunc: Function) => {
      const bodyStr = "\n body: " + JSON.stringify(req.body);
      return fmtFunc(":status -- :method :url") + bodyStr;
    }
  }));
  app.use(mung.json((body: any, req: Request, res: Response) => {
    const tag = "(" + (req.originalUrl || req.url) + ") Response Body: ";
    logger.info(tag, JSON.stringify(body));
    return body;
  }));
} else {
  app.use(log4js.connectLogger(logger, <any>{
    level: "auto",
    format: (req: Request, res: Response, fmtFunc: Function) => {
      if (res.statusCode !== 200) {
        const bodyStr = "\n body: " + JSON.stringify(req.body);
        return fmtFunc(":status -- :method :url") + bodyStr;
      }
    }
  }));
}
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
