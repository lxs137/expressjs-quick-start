import { Response, Request, Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send("ok");
});

export default indexRouter;
