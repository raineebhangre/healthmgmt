import express from "express";
import { db } from "../src/utils/dbConfig.js";
import { postsTable, repliesTable } from "../src/utils/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// Fetch all posts with replies
router.get("/posts", async (req, res) => {
  try {
    const posts = await db.select().from(postsTable);
    for (const post of posts) {
      const replies = await db.select().from(repliesTable).where(eq(repliesTable.post_id, post.id));
      post.replies = replies;
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Create a new post
router.post("/posts", async (req, res) => {
  try {
    const { text, category, createdBy } = req.body;
    if (!text || !category || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newPost = await db
      .insert(postsTable)
      .values({ text, category, createdBy })
      .returning();
    res.status(201).json(newPost[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Create a new reply
router.post("/posts/:id/replies", async (req, res) => {
  try {
    const { text, createdBy } = req.body;
    if (!text || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newReply = await db
      .insert(repliesTable)
      .values({ post_id: req.params.id, text, createdBy })
      .returning();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ error: "Failed to create reply" });
  }
});

export default router;