"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

let path = require("path");

let express = require("express");
let favicon = require("serve-favicon");
let i18n = require("i18n");
let cookieP = require("cookie-parser");

let conf = require("./utils/configHandler");
let log = require("./utils/logger");
let meta = require("./utils/meta");

let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

let splashPadding = 12 + appname.length + version.toString().length;

console.log(
    "\n" +
    " #" + "-".repeat(splashPadding) + "#\n" +
    " # Started " + appname + " v" + version + " #\n" +
    " #" + "-".repeat(splashPadding) + "#\n\n" +
    " Copyright (c) " + (new Date()).getFullYear() + " " + devname + "\n"
);

let app = express();

log.info("Started.");

meta(function(data){
    log.info(`Environment: '${data.environment}'`);
    log.info(`NodeJS Version: ${data.nodeversion}`);
    log.info(`Operating System: ${data.os}`);
    log.info(`Server IP: ${data.ip}`);
});

let config = conf.getConfig();

i18n.configure({
    directory: "./src/languages",
    cookie: config.server.cookie_prefix + "lang",
    defaultLocale: "en",
    queryParameter: "lang",
    updateFiles: false,
    autoReload: true,
});

app.locals.languages = Object.keys(i18n.getCatalog());

const appPort = config.server.port || 3000;

if (!config.server.port) log.warn("No port specified. Using default: 3000");

if (appPort < 1 || appPort > 65535){
    log.error("Invalid port specified: " + appPort + "\nStopping...");
    process.exit(1);
}

app.enable("trust proxy");

app.set("view engine", "ejs");
app.set("port", appPort);
app.set("views", path.join(__dirname, "views"));

app.use(cookieP());
app.use(express.static("./src/assets/static"));
app.use(favicon("./src/assets/static/img/favicon.png"));
app.use(i18n.init);

require("./routes/router")(app);

app.listen(app.get("port"), function(err){
    if (err){
        log.error("Error on port " + app.get("port") + ": " + err);
        process.exit(1);
    }
    log.info("Listening on port " + app.get("port") + "...");
});
