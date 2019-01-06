"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Dependencies
let { check, validationResult } = require("express-validator/check");
let { matchedData } = require("express-validator/filter");


// Utils
let getRoutes = require("./getRoutes");
let log = require("../utils/logger");
let conf = require("../utils/configHandler");

// Modules
let robots = require("./modules/robots");
let sitemap = require("./modules/sitemap");

let routes;

module.exports = function(app){
    app.get("/", (req, res) => {
        res.render("index", {
            "routeTitle": "Home",
            "route": req.path,
            "conf": conf,
            "csrfToken": req.csrfToken()
        });
    });

    app.get("/contact", (req, res) => {
        res.render("contact", {
            "routeTitle": "Contact",
            "route": req.path,
            "conf": conf,
            "csrfToken": req.csrfToken(),
            "data": {},
            "errors": {}
        });
    });

    app.post("/contact", [
        check("message").isLength({ min: 1 }).withMessage("Message field must not be empty").trim(),
        check("email").isEmail().withMessage("Email appears to be invalid.").trim().normalizeEmail()
    ], (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()){
            res.render("contact", {
                "routeTitle": "Contact",
                "route": req.path,
                "conf": conf,
                "csrfToken": req.csrfToken(),
                "data": req.body,
                "errors": errors.mapped()
            });
        }

        else {
            let formData = matchedData(req);

            req.flash("success", "Message has been delivered. I'll reply as soon as possible!");
            res.redirect(req.originalUrl);
        }
    });

    app.get("/robots.txt", (req, res) => {
        robots(req, res);
    });

    app.get("/sitemap.xml", (req, res) => {
        sitemap(req, res, routes);
    });

    // Errors

    // 404
    app.get("*", (req, res) => {
        res.render("errors/404", {
            "routeTitle": "Not found!",
            "route": req.path,
            "conf": conf,
            "csrfToken": req.csrfToken()
        });
    });

    // 500
    app.use((err, req, res, next) => {
        log.error(err.stack);
        res.render("errors/500", {
            "routeTitle": "Internal Server Error!",
            "route": req.path,
            "conf": conf,
            "csrfToken": req.csrfToken()
        });
    });

    routes = getRoutes(app);
    for (let i in routes) log.info("Route '" + routes[i].path + "' registered with methods '" + (routes[i].methods).join(", ") + "'");
};
