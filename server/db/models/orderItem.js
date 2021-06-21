const Sequelize = require('sequelize');
const db = require('../db');

const OrderItems = db.define('orderItems', {
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
  },
});

OrderItems.beforeCreate(async (orderItem, options) => {
  const card = await orderItem.getCard();
  orderItem.price = orderItem.quantity * card.price;
});

OrderItems.beforeUpdate(async (orderItem, options) => {
  const card = await orderItem.getCard();
  orderItem.price = orderItem.quantity * card.price;
});

module.exports = OrderItems;
