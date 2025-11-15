# Markdown Renderer

This website renders Markdown documents as webpages.

## Features

### Pages are Markdown documents

All the Markdown documents are stored in the `documents` directory.

Make sure to include links to new pages in the `homepage.md` document!

### Automatically generated table of contents

A table of contents is automatically generated for every page thanks to a custom renderer rule.

### Responsive

Text can be read on small screen sizes.

## Configuration

Download the files and then run `npm install`.

### .env file

Create a `.env` file containing `PROJECT_NAME` and `PROJECT_PORT` before using. Here's a sample configuration:

```
PROJECT_PORT=3000
PROJECT_NAME="Markdown Renderer"
```

### homepage.md

This will become the website's homepage. The program will exit if no `homepage.md` is found. Make sure to always have a file named `homepage.md` in the `documents` directory.