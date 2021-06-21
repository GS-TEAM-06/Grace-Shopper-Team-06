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

Orders.afterUpdate(async (order, options) => {
  if (
    order.dataValues.isOpen === false &&
    order._previousDataValues.isOpen === true
  ) {
    // we are closing an open cart
    // take cards out of inventory
    (await order.getOrderItems()).forEach(async (orderItem) => {
      let card = await orderItem.getCard();

      const update = await card.update({
        quantity: card.quantity - orderItem.quantity,
      });
    });
  }
});

module.exports = Orders;
