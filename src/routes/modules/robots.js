"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

let conf = require("../../utils/configHandler");

let config = conf.getConfig();

module.exports = function(req, res){
    let cYear = (new Date()).getFullYear();
    res.type("text/plain");
    res.send(
        "#" + "-".repeat(17 + cYear.toString().length + (config.meta.name).length) + "#\n" +
        "# Copyright (c) " + cYear + " " + config.meta.name + " #\n" +
        "#" + "-".repeat(17 + cYear.toString().length + (config.meta.name).length) + "#\n\n" +
        "User-agent: *\n" +
        "Disallow: /css\n" +
        "Disallow: /img\n" +
        "Disallow: /js\n" +
        "Disallow: /lib\n\n" +
        "Sitemap: https://nulldev.org/sitemap.xml"
    );
};
