"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Utils
let conf = require("../../utils/configHandler");

let config = conf.getConfig();

/**
 * Generate sitemap.xml
 *
 * @param {*} req
 * @param {*} res
 * @param {*} routes
 */
module.exports = function(req, res, routes){
    res.type("text/xml");

    /* eslint-disable quotes */

    let routeString = "";
    for (let route of routes){
        if (route.path === "*") continue;

        routeString += `    <url>\n` +
                       `        <loc>${config.meta.protocol}://${config.meta.domain}${route.path}</loc>\n` +
                       `        <changefreq>monthly</changefreq>\n` +
                       `    </url>\n`;
    }

    res.send(
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        routeString +
        `</urlset>\n`
    );
};
