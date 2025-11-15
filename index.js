import "dotenv/config";
import markdownit from "markdown-it";
import fs from "fs";

import express from "express";
const app = express();
const port = process.env.PROJECT_PORT;
const appName = process.env.PROJECT_NAME;

const md = markdownit();

app.use(express.static('public'))

// generate urls from custom renderer rule output

function generateUrls(urls) {
  let final = ["<h2>Table of Contents</h2>"];
  for (const i in urls) {
    final.push(`<a class="indent-${urls[i].type}" href="#${urls[i].text}">${urls[i].text}</a>`);
  }
  return final.join("")
}

// try to load homepage.md; exit if failure

let homepage;
try {
  homepage = fs.readFileSync("./documents/homepage.md", {
    encoding: "utf8",
    flag: "r",
  });
} catch {
  console.log("homepage.md was not found. please create it and try again.");
  process.exit();
}

// custom renderer rule; takes an empty array as argument, will fill it with html heading elements.

let headings = ["h1", "h2", "h3", "h4", "h5", "h6"];

md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
  let content = tokens[idx + 1].content;
  tokens[idx].attrSet("id", content);
  if (headings.includes(tokens[idx].tag)) {
    env.urlsArray.push({ text: content, type: tokens[idx].tag });
  }
  return self.renderToken(tokens, idx, options);
};

// process homepage

let homepageUrls = [];
let homepageRender = md.render(homepage, { urlsArray: homepageUrls });
console.log("homepage.md was successfully loaded.");

app.get("/", (req, res) => {
  res.render("main.ejs", {data: homepageRender, title: homepageUrls[0].text, urls: generateUrls(homepageUrls)});
});

// process singular pages

app.get("/page/:pageName", (req, res) => {
  let requestedPage = req.params.pageName;
  let page;
  let pageUrls = [];
  try {
    page = fs.readFileSync(`./documents/${requestedPage}.md`, {
      encoding: "utf8",
      flag: "r",
    });
    let pageRender = md.render(page, { urlsArray: pageUrls });
    res.render("main.ejs", {data: pageRender, title: pageUrls[0].text, urls: generateUrls(pageUrls)});
  } catch {
    res.render("error.ejs", {data: requestedPage});
  }
});

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log("SMILE! you're in production");
  }
  console.log(`${appName} is listening on port ${port}`);
});
