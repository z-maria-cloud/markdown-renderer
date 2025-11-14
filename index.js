import "dotenv/config";
import markdownit from "markdown-it";
import fs from "fs";

import express from "express";
const app = express();
const port = process.env.PROJECT_PORT;
const appName = process.env.PROJECT_NAME;

const md = markdownit();

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

let homepageRender = md.render(homepage);
console.log("homepage.md was successfully loaded.");

app.get("/", (req, res) => {
  res.render("main.ejs", { data: homepageRender });
});

app.get("/page/:pageName", (req, res) => {
  let requestedPage = req.params.pageName;
  let responseView, page, resData;
  try {
    page = fs.readFileSync("./documents/`${}`.md", {
      encoding: "utf8",
      flag: "r",
    });
    pageRender = md.render(page);
    res.render("main.ejs", { data: pageRender });
  } catch {
    res.render("error.ejs");
  }
});

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log("SMILE! you're in production");
  }
  console.log(`${appName} is listening on port ${port}`);
});
