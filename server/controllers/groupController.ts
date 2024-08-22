import type { Request, Response } from "express";
import Group from "../models/group";

// Get a group by name
export const getGroups = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    let groups;
    if (name) {
      const filter = name ? { name: new RegExp(name as string, "i") } : {};
      groups = await Group.find(filter).select(
        "name description visibility groupImage members",
      );
    } else {
      groups = await Group.find();
    }
    res.status(200).json(groups);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching groups", error: error.message });
  }
};

// Get a group by ID
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching group", error: error.message });
  }
};

// Create a new group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, visibility, groupImage, coverImage } = req.body;

    // const admin = req.user._id;

    // For testing purposes, we will use a hardcoded admin ID
    const admin = "66c36b92488bc3d7cbd08b6c";

    const profileImage = processImage(req.file);
    const group = new Group({
      name,
      description,
      visibility,
      groupImage,
      coverImage,
      admins: [admin],
      members: [admin],
    });

    await group.save();
    res.status(201).json(group);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating group", error: error.message });
  }
};

// Update a group by ID
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (group) {
      group.name = req.body.name || group.name;
      group.description = req.body.description || group.description;
      group.visibility = req.body.visibility || group.visibility;
      group.groupImage = req.body.groupImage || group.groupImage;
      group.coverImage = req.body.coverImage || group.coverImage;
      group.admins = req.body.admins || group.admins;
      group.members = req.body.members || group.members;
      group.posts = req.body.posts || group.posts;

      const updatedGroup = await group.save();
      res.status(200).json(updatedGroup);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating group", error: error.message });
  }
};

// Delete a group by ID
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully", id });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting group", error: error.message });
  }
};
