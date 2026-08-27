const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("./db");

const router = express.Router();

// Get all gifts
router.get("/api/gifts", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const gifts = await db.collection("items").find({}).toArray();
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get gift by ID
router.get("/api/gifts/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const gift = await db.collection("items").findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!gift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    res.json(gift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;