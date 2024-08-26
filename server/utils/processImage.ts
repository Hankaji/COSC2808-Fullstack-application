import { Express } from "express"; // Import the Express types

interface Image {
  data: Buffer;
  contentType: string;
}

export function processImage(
  file: Express.Multer.File | undefined,
): Image | null {
  if (file) {
    return {
      data: file.buffer,
      contentType: file.mimetype,
    };
  }

  return null;
}
// export const getProfilePic = async (req, res) => {
//   try {
//     const { username } = req.params;
//
//     // Find the user by their username
//     const user = await User.findOne({ username });
//
//     if (!user || !user.profileImage || !user.profileImage.data) {
//       return res.status(404).send("Image not found.");
//     }
//     const base64Image = `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString("base64")}`;
//     res.set("Content-Type", "text/html");
//     res.send(Buffer.from(`<img src="${base64Image}" />`));
//   } catch (error) {
//     console.error("Error retrieving image:", error);
//     res.status(500).send("Server error.");
//   }
// };
