//this is the access point for all things database related!

const db = require("./db");
const Address = require("./models/Address");
const Cards = require("./models/Cards");
const User = require("./models/user");

//associations could go here!

User.hasMany(Address);
Address.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    Address,
    Cards,
  },
};
