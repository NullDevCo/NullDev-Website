"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Core Modules
let fs = require("fs");
let path = require("path");

// Utils
let log = require("../src/utils/logger");

let blogFolder = path.resolve("blogposts");

let markup = "";

if (fs.existsSync(blogFolder) && fs.readdirSync(blogFolder).length > 0){
    fs.readdirSync(blogFolder).reverse().forEach(file => {
        let absolutPath = path.resolve(blogFolder, file);
        if (fs.statSync(absolutPath).isDirectory()) return;

        let num = file.replace(/\.md/gi, "");
        let content = fs.readFileSync(absolutPath);

        let entryData;
        try {
            entryData = JSON.parse(String(content).split("<!--DATA").pop().split("-->")[0]);
        }
        catch (e){
            log.error(`Blog entry ${num} has invalid JSON Meta!`);
        }

        markup += `
<a href="/blog/${num}">#${num} - ${entryData.title}</a>
<br>
<p>${entryData.preface}</p>
<p>Date: ${entryData.date}</p>
<hr>
<br>
`;
    });
}

else {
    markup += `
<br>
<p>Currently no blog entries.</p>
`;
}

let entryPath = path.resolve("dist_entries");

fs.mkdirSync(entryPath, { recursive: true });
fs.writeFileSync(path.join(entryPath, "entries.html"), markup);
process.exit(0);
