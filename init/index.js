const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");  // Ensure the Review model is imported

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit the process if unable to connect to the database
    }
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,
        owner:"6689c6748c30af065b6e5a7e"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
};

main();
initDB();
