"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Core Modules
let path = require("path");

// Dependencies
let express = require("express");
let favicon = require("serve-favicon");
let minify = require("express-minify");
let bodyParser = require("body-parser");
let validator = require("express-validator");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let flash = require("express-flash");
let MemoryStore = require("memorystore")(session);
let helmet = require("helmet");
let csrf = require("csurf");

// Utils
let conf = require("./utils/configHandler");
let log = require("./utils/logger");
let meta = require("./utils/meta");

let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

let splashPadding = 12 + appname.length + version.toString().length;

console.log(
    "\n" +
    ` #${"-".repeat(splashPadding)}#\n` +
    ` # Started ${appname} v${version} #\n` +
    ` #${"-".repeat(splashPadding)}#\n\n` +
    ` Copyright (c) ${(new Date()).getFullYear()} ${devname}\n`
);

let app = express();

log.done("Started.");

meta((data) => {
    log.info(`Environment: '${data.environment}'`);
    log.info(`NodeJS Version: ${data.nodeversion}`);
    log.info(`Operating System: ${data.os}`);
    log.info(`Server IP: ${data.ip}`);
});

let config = conf.getConfig();

let sess = {
    secret: config.session.secret,
    key: config.session.key,
    // @ts-ignore
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxage
    }
};

let bodyParserConf = {
    extended: true
};

let csrfParserConf = {
    cookie: true
};

const appPort = config.server.port || 3000;

if (!config.server.port) log.warn("No port specified. Using default: 3000");

if (appPort < 1 || appPort > 65535){
    log.error(`Invalid port specified: ${appPort}\nStopping...`);
    process.exit(1);
}

app.enable("trust proxy");

app.set("view engine", "ejs");
app.set("port", appPort);
app.set("views", path.join(__dirname, "views"));

app.use(helmet());
app.use(bodyParser.urlencoded(bodyParserConf));
app.use(session(sess));
app.use(validator());
app.use(cookieParser());
app.use(csrf(csrfParserConf));
app.use(flash());
app.use(favicon("./src/assets/static/img/favicon.png"));

app.use((req, res, next) => {
    log.info("User Accessed: " + req.url);
    if (/\.min\.(css|js)$/.test(req.url)){
        // @ts-ignore
        res.minifyOptions = res.minifyOptions || {};
        // @ts-ignore
        res.minifyOptions.minify = false;
    }
    next();
});

app.use(minify());
app.use(express.static("./src/assets/static"));

require("./routes/router")(app);

process.on("unhandledRejection", (err, promise) => log.error(`Unhandled rejection (promise: ${promise}, reason: ${err})`));

app.listen(app.get("port"), (err) => {
    if (err){
        log.error(`Error on port ${app.get("port")}: ${err}`);
        process.exit(1);
    }
    log.info(`Listening on port ${app.get("port")}...`);
});
