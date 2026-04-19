import express from "express";
import { pushCode } from "../controllers/pushControllers.js";
import { checkRepo } from "../controllers/pushControllers.js";

const pushRouter = express.Router();

//  Push code to GitHub
pushRouter.post("/push", pushCode);
pushRouter.get("/check-repo", checkRepo);

export default pushRouter;