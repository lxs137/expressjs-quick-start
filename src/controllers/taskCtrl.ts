import { Document } from "mongoose";
import * as log4js from "log4js";
import { Task } from "models/task";
const logger = log4js.getLogger("taskCtrl");

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