const allowedOrigins = require("./allowedOrigins");

// third party middleware .. documentation dekhte hobe oder ..
const corsOptions = {
    // lookup object
    origin: (origin, callback) => {
        // ⏳ 52 : 36
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // null means .. we dont have any error // true mane allowed
        } else {
            callback(new Error("Not allowed by CORS")); // first argument ei error provide korlam
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;
