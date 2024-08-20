import express from "express";
import { searchGroupByName, getGroupById, createGroup, updateGroup, deleteGroup } from "../controllers/groupController";

const groupRouter = express.Router();

groupRouter.get("/", searchGroupByName);
groupRouter.get("/:id", getGroupById);
groupRouter.post("/", createGroup);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", deleteGroup);

export default groupRouter;
