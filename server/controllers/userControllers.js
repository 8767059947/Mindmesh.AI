import sql from "../configs/db.js";



export const getUserCreations = async (req,res) => {
    try {
        const {userId} = req.auth();
        const creations = await sql`Select * from creations where user_id = ${userId} order by created_at desc`;
        res.json({success: true, creations});
        
    } catch (error) {
        res.json({success: false, message: error.message});
        
    }
}


export const getPublishedCreations = async (req ,res) => {
    try {
        const creations = await sql`Select * from creations where publish = true order by created_at desc`;
        res.json({success: true, creations});
        
    } catch (error) {
        res.json({success: false, message: error.message});
        
    }
}

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    // Ensure creation.likes is always an array; if null/undefined, initialize as empty
    // The schema shows DEFAULT '{}'::text[], so it should always be an array, but good for safety
    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      // User has liked it, so unlike
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation Unliked";
    } else {
      // User has not liked it, so like
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    // --- CRITICAL FIX: Manually format the array into a PostgreSQL array literal string ---
    // This creates a string like '{element1,element2}' which PostgreSQL expects for TEXT[]
    const postgresArrayString = `{${updatedLikes.join(',')}}`;
    // --- END CRITICAL FIX ---

    // Update the database with the correctly formatted array string
    // Since 'likes' is TEXT[], passing the string '{...}' is the correct way
    await sql`UPDATE creations SET likes = ${postgresArrayString} WHERE id = ${id}`;

    res.json({ success: true, message });
  } catch (error) {
    console.error("Error toggling like:", error); // Log the actual error for debugging
    res.json({ success: false, message: error.message });
  }
};