const { format } = require("date-fns");
const { v4: uuid } = require("uuid"); // create specific id for each log
const fs = require("fs"); // for file system // shift + alt + down arrow
const fsPromises = require("fs").promises;
const path = require("path");

// helper function
const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`; // every line er por new line print korbe

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            // directory exist na korle create korbo
            await fsPromises.mkdir(path.join(__dirname, "..", "logs")); // .. to go to out of the folder
        }
        // exist korle append korbo ..
        await fsPromises.appendFile(
            path.join(__dirname, "..", "logs", logFileName),
            logItem
        );
    } catch (err) {
        console.log(err);
    }
};

// actual middleware ..
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log"); // text file e save korbo
    console.log(`${req.method} ${req.path}`); // server e jei log dekhte chai .. sheta bole dilam
    next();
};

module.exports = { logEvents, logger };
