const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const giftRoutes = require("./giftRoutes");
const searchRoutes = require("./searchRoutes");
const authRoutes = require("./authRoutes");

app.use(authRoutes);
app.use(giftRoutes);
app.use(searchRoutes);

app.get("/", (req, res) => {
  res.send("GiftLink API is running");
});

module.exports = app;