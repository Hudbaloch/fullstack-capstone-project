const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("./db");


const router = express.Router();

// Register
router.post("/api/auth/register", express.json(), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const db = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
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
    res.status(500).json({
      error: error.message
    });
  }
});

// Login
router.post("/api/auth/login", express.json(), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const db = await connectToDatabase();

    const user = await db.collection("users").findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || "giftlink-secret",
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Update user information
router.put("/api/auth/users/:id", express.json(), async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const db = await connectToDatabase();

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          name,
          email
        }
      }
    );

    res.json({
      message: "User information updated",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;