import * as Joi from "joi";
import { Response, Request, NextFunction, RequestHandler } from "express";

const ParamUnvalidateStatusCode = 400;

export const validate = (schema: any, options?: any): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    options = options || {
      convert: false
    };
    const unValidateObj: any = {};
    ["params", "query", "body"].forEach((item) => {
      if(schema[item]) {
        switch (item) {
          case "params":
            unValidateObj["params"] = req.params;
            break;
          case "query":
            unValidateObj["query"] = req.query;
            break;
          case "body":
            unValidateObj["body"] = req.body;
        }
      }
    });
    Joi.validate(unValidateObj, schema, options, (err: any, value: any) => {
      if(err) {
        return res.status(ParamUnvalidateStatusCode).send("params unValidate");
      } else {
        return next();
      }
    });
  };
};