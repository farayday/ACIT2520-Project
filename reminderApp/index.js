const express = require("express");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");

const app = express();

app.use(ejsLayouts);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

app.use("/reminders", reminderController);
app.use("/", authController);

app.listen(3001, () => {
  console.log(
    "Server running. Visit: http://localhost:3001/login in your browser 🚀"
  );
});
