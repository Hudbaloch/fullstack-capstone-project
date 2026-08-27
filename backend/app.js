const express = require("express");
const cors = require("cors");

const giftRoutes = require("./giftRoutes");
const searchRoutes = require("./searchRoutes");

const app = express();

const authRoutes = require("./authRoutes");
app.use(authRoutes);

app.use(cors());
app.use(express.json());

app.use(giftRoutes);
app.use(searchRoutes);

app.get("/", (req, res) => {
  res.send("GiftLink API is running");
});

module.exports = app;