import express from "express";
import { githubLogin, githubCallback } from "../controllers/authControllers.js";
import { logout } from "../controllers/authControllers.js";

const authRouter = express.Router();

//  Step 1: Redirect to GitHub OAuth
authRouter.get("/github", githubLogin);

//Step 2: Handle OAuth callback
authRouter.get("/github/callback", githubCallback);

authRouter.post("/logout", logout);

export default authRouter;