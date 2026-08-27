const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("./db");

const router = express.Router();

router.post("/api/auth/register", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { name, email, password } = req.body;

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registration successful",
      userId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { email, password } = req.body;

    const user = await db.collection("users").findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "giftlink-secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/api/auth/users/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { name, email } = req.body;

    const result = await db.collection("users").updateOne(
      { _id: new (require("mongodb").ObjectId)(req.params.id) },
      { $set: { name, email } }
    );

    res.json({
      message: "User information updated",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;