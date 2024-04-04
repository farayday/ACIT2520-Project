let database = require("../database");
const fs = require('fs');
const { EOL } = require('os');

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database.cindy.reminders.push(reminder);

    let data = JSON.stringify(database, null, 2);

    fs.writeFile('database.js', 'let Database = ' + data + EOL + 'module.exports = Database;', (err) => {
      if (err) {
        throw err;
      }
      console.log('Data written to file');
    });
    res.redirect("/reminders");
    
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implementation here 👈
    
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    searchResult.title = req.body.title;
    searchResult.description = req.body.description;
    searchResult.completed = req.body.completed === 'true' ? true : false;

    let data = JSON.stringify(database, null, 2);

    fs.writeFile('database.js', 'let Database = ' + data + EOL + 'module.exports = Database;', (err) => {
      if (err) {
      throw err;
      }
      console.log('Data written to file');
    });
    res.redirect("/reminder/"+reminderToFind);
  },


  delete: (req, res) => {
    // implementation here 👈
  },
};

module.exports = remindersController;
