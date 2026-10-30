// Starts the backend HTTP server.


require("dotenv").config();
require("dotenv").config();

const {
  validateEnvironment,
} = require("./config/env");

validateEnvironment();

const app = require("./app");



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`WearHouse server running on http://localhost:${PORT}`);
});