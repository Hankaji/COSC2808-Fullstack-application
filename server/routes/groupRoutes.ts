import express from "express";
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/groupController";
import multer from "multer";
var storage = multer.memoryStorage();

var upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: "groupImage", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
const groupRouter = express.Router();

groupRouter.get("/", getGroups);
groupRouter.get("/:id", getGroupById);
groupRouter.put("/:id", updateGroup);
groupRouter.delete("/:id", deleteGroup);
groupRouter.post("/", uploadFields, createGroup);

export default groupRouter;
