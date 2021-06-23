const Sequelize = require('sequelize');
const db = require('../db');

const Orders = db.define('orders', {
  isOpen: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  total: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

// async get() {
//   const orderItems = await this.getOrderItems({ raw: true });
//   if (orderItems.length === 0) {
//     return 0;
//   } else {
//     return orderItems.reduce((acc, orderItem) => {
//       return (acc += orderItem.price);
//     }, 0);
//   }
// },

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

Orders.prototype.updateTotal = async function () {
  const orderItems = await this.getOrderItems({ raw: true });
  const newTotal = orderItems.reduce((acc, orderItem) => {
    return (acc += orderItem.price);
  }, 0);
  // this.total = newTotal;
  await this.update({ total: newTotal });
};
module.exports = Orders;
