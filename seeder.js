const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars

dotenv.config({path: "./config/config.env"});

// Load models

const Event = require("./models/Event");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files

const events = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/events.json`, "utf-8")
);

// Import into DB

const importData = async () => {
  try {
    await Event.create(events);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data

const deleteData = async () => {
  try {
    await Event.deleteMany();

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
