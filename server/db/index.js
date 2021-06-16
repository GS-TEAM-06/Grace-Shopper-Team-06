//this is the access point for all things database related!

const db = require('./db');
const Address = require('./models/Address');
const Cards = require('./models/Cards');
const User = require('./models/user');
const Orders = require('./models/order');
const OrderItems = require('./models/orderItem');

//associations could go here!

User.hasMany(Address);
Address.belongsTo(User);

Orders.hasMany(OrderItems);
OrderItems.belongsTo(Orders);

OrderItems.belongsTo(Cards);
Cards.hasMany(OrderItems);

User.hasMany(Orders);
Orders.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    Address,
    Cards,
  },
};
