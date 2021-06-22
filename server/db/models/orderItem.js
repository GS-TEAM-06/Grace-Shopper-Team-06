const Sequelize = require('sequelize');
const db = require('../db');
const Orders = require('./order');

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

  // const cart = await orderItem.getOrder();
  // const cartOrderItems = await cart.getOrderItems({ raw: true });
  // const newTotal = cartOrderItems.reduce((acc, orderItem) => {
  //   return (acc += orderItem.price);
  // }, 0);
  // cart.total = newTotal;
  // await cart.save();
});

OrderItems.beforeUpdate(async (orderItem, options) => {
  const card = await orderItem.getCard();
  orderItem.price = orderItem.quantity * card.price;

  // const cart = await orderItem.getOrder();
  // const cartOrderItems = await cart.getOrderItems({ raw: true });
  // const newTotal = cartOrderItems.reduce((acc, orderItem) => {
  //   return (acc += orderItem.price);
  // }, 0);
  // cart.total = newTotal;
  // await cart.save();
});

// OrderItems.beforeDestroy(async (orderItem, options) => {
//   const cart = await orderItem.getOrder();
//   const cartOrderItems = await cart.getOrderItems({ raw: true });
//   const newTotal = cartOrderItems.reduce((acc, orderItem) => {
//     return (acc += orderItem.price);
//   }, 0);
//   cart.total = newTotal;
//   await cart.save();
// });

// OrderItems.afterUpdate(async (orderItem, options) => {
//   console.log('UPDATING AN ORDER');
//   // we are adding or deleting an item, update the total
// });

module.exports = OrderItems;
