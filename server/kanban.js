import express from "express";
import { db } from "../src/utils/dbConfig.js";
import { Records } from "../src/utils/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// Fetch Kanban board state for a specific record
router.get("/records/:id/kanban", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await db.select().from(Records).where(eq(Records.id, id)).limit(1);

    if (!record[0]) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Parse the kanbanRecords field (assuming it's stored as JSON)
    const kanbanRecords = record[0].kanbanRecords ? JSON.parse(record[0].kanbanRecords) : null;

    res.status(200).json(kanbanRecords);
  } catch (error) {
    console.error("Error fetching Kanban board:", error);
    res.status(500).json({ error: "Failed to fetch Kanban board" });
  }
});

// Update Kanban board state for a specific record
router.put("/records/:id/kanban", async (req, res) => {
  try {
    const { id } = req.params;
    const { columns, tasks } = req.body;

    if (!columns || !tasks) {
      return res.status(400).json({ error: "Missing required fields (columns, tasks)" });
    }

    // Convert the Kanban state to a JSON string
    const kanbanRecords = JSON.stringify({ columns, tasks });

    // Update the record in the database
    const updatedRecord = await db
      .update(Records)
      .set({ kanbanRecords })
      .where(eq(Records.id, id))
      .returning();

    res.status(200).json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating Kanban board:", error);
    res.status(500).json({ error: "Failed to update Kanban board" });
  }
});

export default router;