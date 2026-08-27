require("dotenv").config();
const app = require("./app");
const natural = require("natural");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GiftLink server running on port ${PORT}`);
});