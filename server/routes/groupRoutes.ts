import express from "express";

import { createGroup } from "../controllers/groupController";

const groupRouter = express.Router();

groupRouter.post("/createGroup", createGroup);

export default groupRouter;
