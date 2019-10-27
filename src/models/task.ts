import * as mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: String,
  create_at: {
    type: Date,
    required: true,
    default: Date.now
  }
});

export const Task = mongoose.model("Task", TaskSchema);