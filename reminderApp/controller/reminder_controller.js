const database = require("../database");
const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user) {
    return res.redirect("/");
  }
  next();
});

router.get("/", (req, res) => {
  res.render("reminder/index", { reminders: req.user.reminders });
});

router.get("/new", (req, res) => {
  res.render("reminder/create");
});

router.get("/:id", (req, res) => {
  let reminderToFind = req.params.id;
  let searchResult = req.user.reminders.find(function (reminder) {
    return reminder.id == reminderToFind;
  });
  if (searchResult != undefined) {
    res.render("reminder/single-reminder", { reminderItem: searchResult });
  } else {
    res.render("reminder/index", { reminders: req.user.reminders });
  }
});

router.get("/:id/edit", (req, res) => {
  let reminderToFind = req.params.id;
  let searchResult = req.user.reminders.find(function (reminder) {
    return reminder.id == reminderToFind;
  });
  res.render("reminder/edit", { reminderItem: searchResult });
});

router.post("/create", (req, res) => {
  let reminder = {
    id: req.user.reminders.length + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false,
  };
  req.user.reminders.push(reminder);
  database.save();

  res.redirect("/reminders");
});

router.post("/:id/update", (req, res) => {
  let reminderToFind = req.params.id;
  let searchResult = req.user.reminders.find(function (reminder) {
    return reminder.id == reminderToFind;
  });
  searchResult.title = req.body.title;
  searchResult.description = req.body.description;
  searchResult.completed = req.body.completed === "true" ? true : false;

  database.save();

  res.redirect("/reminders/" + reminderToFind);
});

router.post("/:id/delete", (req, res) => {
  let reminderToFind = req.params.id;
  let reminderIndex = req.user.reminders.findIndex(function (reminder) {
    return reminder.id == reminderToFind;
  });

  req.user.reminders.splice(reminderIndex, 1);

  database.save();

  res.redirect("/reminders");
});

module.exports = router;
