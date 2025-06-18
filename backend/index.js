const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
require('dotenv').config();
const personRoutes = require("./Routes/person");
const authRoutes = require("./Routes/auth");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8080;


// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/person", personRoutes);
app.use("/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/person`);
});
