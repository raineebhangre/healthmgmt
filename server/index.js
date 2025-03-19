import express from "express";
import cors from "cors";
import postsRoutes from "./posts.js";  // ✅ Ensure correct path

const app = express();
app.use(cors());
app.use(express.json());  // ✅ Required to parse JSON in requests

app.use("/api", postsRoutes);  // ✅ This exposes "/api/posts"

app.listen(5000, () => {
  console.log("Server running on port 5000");
});