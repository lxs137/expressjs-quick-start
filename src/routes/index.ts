import { Response, Request, Router } from "express";
import { createTask } from "controllers/taskCtrl";

const indexRouter = Router();

indexRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send("ok");
});

indexRouter.post("/task", (req: Request, res: Response) => {
  const { id, name } = req.body;
  createTask(id, name).then(
    (task) => res.status(200).json(task),
    (err) => res.status(500).send(err)
  );
});

export default indexRouter;
