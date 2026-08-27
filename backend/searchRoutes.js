const express = require("express");
const { connectToDatabase } = require("./db");

const router = express.Router();

router.get("/api/search", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { category } = req.query;

    const filter = category ? { category: category } : {};

    const items = await db.collection("items").find(filter).toArray();

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;