const express = require("express");
const dotenv = require("dotenv");
require("colors");
const errorHandler = require("./middleware/error");
const cors = require("cors");

const conectDB = require("./config/db");

const events = require("./routes/events");

dotenv.config({path: "./config/config.env"});

conectDB();

const app = express();
app.use(express.json());

// Protect
app.use(cors());

app.use("/api/events", events);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
