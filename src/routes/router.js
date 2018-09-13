"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

let url  = require("url");
let i18n = require("i18n");

let getRoutes = require("./getRoutes");
let log = require("../utils/logger");
let conf = require("../utils/configHandler");

let config = conf.getConfig();

let isset = function(obj){
    return !!(obj && obj !== null && (typeof obj === "string" || typeof obj === "number" && obj !== "") || obj === 0);
};

module.exports = function(app){
    app.use(function(req, res, next){
        // log("IP " + req.ip + " requested route '" + url.parse(req.url).pathname + "'");

        if (isset(req.query.locale)){
            res.cookie(config.server.cookie_prefix + "lang", req.query.locale, { maxAge: 900000, httpOnly: true });
            i18n.setLocale(req.query.locale);
            res.redirect(req.originalUrl.split("?").shift());
        }

        if (isset(req.cookies._stilang)) i18n.setLocale(req.cookies._stilang);

        next();
    });

    app.get("/", function(req, res){

    });

    app.get("/robots.txt", function(req, res){

    });

    app.get("*", function(req, res){

    });

    let routes = getRoutes(app);
    for (let i in routes) log.info("Route '" + routes[i].path + "' registered with methods '" + (routes[i].methods).join(", ") + "'");
};
