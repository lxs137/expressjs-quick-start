import { Document } from "mongoose";
import * as log4js from "log4js";
import * as Joi from "joi";
import { Task } from "models/task";
const logger = log4js.getLogger("taskCtrl");

export const CreateTaskReqSchema = {
  "body": {
    id: Joi.string().regex(/^ts-[0-9]{3}$/).required(),
    name: Joi.string().required()
  }
};

export const createTask = (id: string, name: string): Promise<any> => {
  return Task.create({
    "id": id,
    "name": name
  }).then(
    (task: Document) => task.toObject(),
    (reason: any) => {
      logger.error("createTask error: ", reason);
      return Promise.reject(reason);
    } 
  );
}

export const queryTasksByName = (name: string): Promise<any> => {
  return Task.find({
    "name": name
  }).exec().then(
    (tasks: Document[]) => tasks.map(item => item.toObject()),
    (reason: any) => {
      logger.error("queryTask error: ", reason);
      return Promise.reject(reason);
    }
  )
}