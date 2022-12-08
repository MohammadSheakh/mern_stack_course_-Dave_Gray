const { logEvents } = require("./logger");

// overwrite the default express error handling ..
const errorHandler = (err, req, res, next) => {
    logEvents(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        "errLog.log" // ebar amra errLog file e save kortesi
    );
    console.log(err.stack); // error er stack ta print kortesi

    const status = res.statusCode ? res.statusCode : 500; // server error
    // status code thakle .. sheta set korbo .. otherwise 500 diye dibo .. mane server error

    res.status(status);

    res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
