import { clerkClient, getAuth } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.json({
        success: false,
        message: "Access denied. Educator role required.",
      });
    }

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error.",
    });
  }
};
