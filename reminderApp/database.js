const fs = require("fs");

const database = JSON.parse(fs.readFileSync("database.json"));

module.exports = {
  get: (email) => {
    return database[email];
  },
  set: (user) => {
    database[user.email] = user;
  },
  exists: (email) => {
    return database[email] !== undefined;
  },
  save: (cb) => {
    fs.writeFile(
      "database.json",
      JSON.stringify(database, null, 2),
      { encoding: "utf8" },
      (err) => {
        if (cb) {
          if (err) {
            return cb(err);
          }
          cb(null);
        }
      }
    );
  },
};
