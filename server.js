require("dotenv").config();

const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const port = 3000;

if (!process.env.SESSION_SECRET) {
  console.error("Missing SESSION_SECRET in .env");
  process.exit(1);
}

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Dibs! running at http://localhost:${port}/`);
});
