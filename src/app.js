"use strict";

//=========================//
//= Copyright (c) NullDev =//
//=========================//

let path    = require("path");
let express = require("express");
let favicon = require("serve-favicon");
let i18n    = require("i18n");
let cookieP = require("cookie-parser");

let conf = require("./utils/configHandler");
let log  = require("./utils/logger");

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

if (!/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(appPort)){
    log.error("Invalid port specified. Stopping...");
    process.exit(1);
}

app.enable("trust proxy");

app.set("view engine", "ejs");
app.set("port", appPort);

app.use(cookieP());
//app.use(express.static("./assets"));
//app.use(favicon("./assets/favicon.ico"));
app.use(i18n.init);

require("./routes/router")(app);

app.listen(app.get("port"), function(err){
    if (err){
        log.error("Error on port " + app.get("port") + ": " + err);
        process.exit(1);
    }
    log.info("Listening on port " + app.get("port") + "...");
});