const mongoose = require('mongoose');

module.exports.connect = async () => {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        throw new Error("MONGO_URL is empty");
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log("Connect MongoDB Success!");
        return;
    } catch (error) {
        console.error(`Connect MongoDB Error!: ${error.message}`);
    }
};
