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

// const updateCartTotal = async (orderItem) => {
//   const cart = await orderItem.getOrder();
//   const cartOrderItems = await cart.getOrderItems({ raw: true });
//   const newTotal = cartOrderItems.reduce((acc, orderItem) => {
//     return (acc += orderItem.price);
//   }, 0);
//   await cart.update({ total: newTotal });
// };

OrderItems.beforeCreate(async (orderItem, options) => {
  const card = await orderItem.getCard();
  orderItem.price = orderItem.quantity * card.price;
});

// OrderItems.afterCreate(async (orderItem, options) => {
//   await updateCartTotal(orderItem);
// });

OrderItems.beforeUpdate(async (orderItem, options) => {
  const card = await orderItem.getCard();
  orderItem.price = orderItem.quantity * card.price;
});

// OrderItems.afterUpdate(async (orderItem, options) => {
//   await updateCartTotal(orderItem);
// });
// OrderItems.beforeDestroy(async (orderItem, options) => {
//   await updateCartTotal(orderItem);
// });

// OrderItems.afterUpdate(async (orderItem, options) => {
//   console.log('UPDATING AN ORDER');
//   // we are adding or deleting an item, update the total
// });

module.exports = OrderItems;
