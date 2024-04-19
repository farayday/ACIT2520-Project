const database = require("../database");
const passport = require("passport");
const crypto = require("crypto");
const express = require("express");
const LocalStrategy = require("passport-local");

passport.use(
  new LocalStrategy((email, password, cb) => {
    const user = database.get(email);
    if (!user) {
      return cb(null, false, {
        message: "Incorrect email or password.",
      });
    }

    const salt = Buffer.from(user.salt, "base64");
    const expectedHash = Buffer.from(user.hash, "base64");

    crypto.scrypt(password, salt, 64, (err, hash) => {
      if (err) {
        return cb(err);
      }

      if (!crypto.timingSafeEqual(hash, expectedHash)) {
        return cb(null, false, {
          message: "Incorrect email or password.",
        });
      }

      return cb(null, user);
    });
  })
);

passport.serializeUser((user, cb) => {
  cb(null, { email: user.email });
});

passport.deserializeUser((session, cb) => {
  const user = database.get(session.email);
  if (!user) {
    return cb(new Error("User does not exist."));
  }
  cb(null, user);
});

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/register", (req, res) => {
  if (database.exists(req.body.email)) {
    req.flash("error", "A user with that email already exists.");
    return res.redirect("/register");
  }

  const salt = crypto.randomBytes(16);
  crypto.scrypt(req.body.password, salt, 64, (err, hash) => {
    if (err) {
      console.error(err);
      req.flash("error", "An unknown error occured.");
      return res.redirect("/register");
    }

    const user = {
      email: req.body.email,
      hash: hash.toString("base64"),
      salt: salt.toString("base64"),
      reminders: [],
    };

    database.set(user);
    database.save();

    req.login(user, (err) => {
      if (err) {
        console.error(err);
        req.flash("error", "An unknown error occured.");
        return res.redirect("/register");
      }
      res.redirect("/reminders");
    });
  });
});

module.exports = router;
