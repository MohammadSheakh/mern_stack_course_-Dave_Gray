const mongoose = require("mongoose");

// ekta async function create korlam ..
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;
