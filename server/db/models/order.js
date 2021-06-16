const Sequelize = require('sequelize');
const db = require('../db');

const Orders = db.define('orders', {
  isOpen: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  total: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

module.exports = Orders;
