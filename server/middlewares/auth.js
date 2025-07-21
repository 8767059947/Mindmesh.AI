import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    // ✅ KEEP THIS AS req.auth() as per Clerk's deprecation warning
    const { userId, has } = await req.auth();

    console.log("Inside custom auth middleware:");
    console.log("Clerk userId:", userId); // Check this in your server console!
    console.log("Clerk has function exists:", typeof has === 'function');

    if (!userId) { // This check is important if requireAuth() somehow lets a request through without userId
        console.error("Auth Middleware: userId is missing from req.auth(). This should not happen if requireAuth() is active.");
        return res.status(401).json({ success: false, message: "Authentication required: userId not found." });
    }
    if (typeof has !== 'function') {
        console.error("Auth Middleware: Clerk 'has' function is missing from req.auth().");
        return res.status(500).json({ success: false, message: "Clerk permissions check not available." });
    }

    const hasPremiumPlan = await has({ plan: 'premium' });

    const user = await clerkClient.users.getUser(userId);

    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, { // Corrected: userId as first arg
        privateMetadata: {
          free_usage: 0
        }
      });
      req.free_usage = 0;
    }
    req.plan = hasPremiumPlan ? 'premium' : 'free';
    next();

  } catch (error) {
    console.error("Error in custom auth middleware:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};