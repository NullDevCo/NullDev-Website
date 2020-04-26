"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Core Modules
let fs = require("fs");
let path = require("path");

// Dependencies
let { check, validationResult } = require("express-validator/check");
let { matchedData } = require("express-validator/filter");

// Utils
let getRoutes = require("./getRoutes");
let log = require("../utils/logger");
let config = require("../utils/configHandler").getConfig();

// Modules
let robots = require("./modules/robots");
let sitemap = require("./modules/sitemap");

let routes;

module.exports = function(app){
    app.get("/", (req, res) => {
        res.render("pages/index", {
            "routeTitle": "Home",
            "route": req.path,
            "config": config,
            "csrfToken": req.csrfToken()
        });
    });

    app.get("/contact", (req, res) => {
        res.render("pages/contact", {
            "routeTitle": "Contact",
            "route": req.path,
            "config": config,
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
            res.render("pages/contact", {
                "routeTitle": "Contact",
                "route": req.path,
                "config": config,
                "csrfToken": req.csrfToken(),
                "data": req.body,
                "errors": errors.mapped()
            });
        }

        else {
            let formData = matchedData(req);
            console.log(formData);

            req.flash("success", "Message has been delivered. I'll reply as soon as possible!");
            res.redirect(req.originalUrl);
        }
    });

    app.get("/blog", (req, res) => {
        res.render("pages/blog", {
            "routeTitle": "Blog",
            "route": req.path,
            "config": config,
            "path": path,
            "csrfToken": req.csrfToken()
        });
    });

    app.get("/blog/:id", (req, res) => {
        let subfolder = "";
        let requestedEntry = path.resolve(__dirname, "..", "..", "dist_blog", req.params.id + ".html");
        if (!fs.existsSync(requestedEntry)) return res.redirect("/404");

        res.render("pages/blogEntry", {
            "routeTitle": "Blog",
            "route": req.path,
            "config": config,
            "blogentry": req.params.id,
            "subfolder": subfolder,
            "csrfToken": req.csrfToken()
        });
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
            "config": config,
            "csrfToken": req.csrfToken()
        });
    });

    routes = getRoutes(app);
    for (let i in routes) log.info("Route '" + routes[i].path + "' registered with methods '" + (routes[i].methods).join(", ") + "'");
};
