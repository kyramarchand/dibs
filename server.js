require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const app = express();
const path = require("path");
const port = 3000;

const USERS_FILE = path.join(__dirname, "data", "users.json");

if (!process.env.SESSION_SECRET) {
  console.error("Missing SESSION_SECRET in .env");
  process.exit(1);
}

// Helpers: read and write the users file
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.static(path.join(__dirname, "public")));

// The guard: blocks anyone who isn't logged in
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login.html");
  }
  next();
}
// REGISTER
app.post("/register", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    // 1. Validate
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).send("Please enter a valid email.");
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).send("Password must be 8 to 72 characters.");
    }

    // 2. Make sure the email isn't already used
    const users = readUsers();
    if (users.find((u) => u.email === email)) {
      return res.status(400).send("That email is already registered.");
    }

    // 3. Hash the password and save the user
    const passwordHash = await bcrypt.hash(password, 10);
    users.push({
      id: Date.now().toString(),
      email: email,
      passwordHash: passwordHash,
    });
    saveUsers(users);

    res.redirect("/login.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again.");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    // 1. Find the user
    const user = readUsers().find((u) => u.email === email);

    // 2. Check the password
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).send("Wrong email or password.");
    }

    // 3. Start the session: this is what "logged in" means
    req.session.userId = user.id;
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again.");
  }
});
// DASHBOARD (protected)
app.get("/dashboard", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
app.listen(port, () => {
  console.log(`Dibs! running at http://localhost:${port}/`);
});
