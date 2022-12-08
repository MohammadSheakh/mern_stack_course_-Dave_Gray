require("dotenv").config(); // throwout our package .. we can use dotenv .. prottek file e likha lagbe na
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

const cors = require("cors"); // eta onek important ...
const corsOptions = require("./config/corsOptions");

const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger); // shob kichur age amra logger e pass korate chai ..

app.use(cors(corsOptions)); // eta onek important .. ke amader API access korte parbe .. sheta define kore
// deowa hoy // option gula amra config file er moddhe bole ditesi

// this will let our app receive and parse that json data .. thats what we expect to use ..
app.use(express.json());

app.use(cookieParser()); // amra third party middleware niyeo kaj korte chai
// our rest API is going to need to be able to parse cookies .. bcz we are going to use them in our application

// built in middleware
app.use("/", express.static(path.join(__dirname, "public"))); // static page access korar jonno

app.use("/", require("./routes/root")); // er maddhome index page dekhacchilam
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes")); // endpoint
app.use("/notes", require("./routes/noteRoutes"));

app.all("*", (req, res) => {
    res.status(404);
    // request er jodi accepts header thake .. sheta jodi html hoy .. taile shetar upor base kore response dibo
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html")); // back end thekei page show kortesi .. 404 er jonno
    } else if (req.accepts("json")) {
        // rest API jehetu json e accept korbe ..
        res.json({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
    );
    // logs folder er moddhe log gula dekha jabe ..
});
