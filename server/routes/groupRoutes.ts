import express from "express";
import { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } from "../controllers/groupController";

const groupRouter = express.Router();

groupRouter.get("/", getGroups);
groupRouter.get("/:id", getGroupById);
groupRouter.post("/", createGroup);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", deleteGroup);

export default groupRouter;
