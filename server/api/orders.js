const router = require('express').Router();
const Orders = require('../db/models/order');
const OrderItems = require('../db/models/orderItem');
const Cards = require('../db/models/Cards');
const { isAuthenticated, isAdmin } = require('../authMiddleware');

// GET ROUTE /orders/orderId

router.get('/', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const orders = await Orders.findAll({
      include: [{ model: OrderItems, include: [Cards] }],
    });
    if (orders.length === 0) {
      res.status(404).end('No orders found!');
    } else {
      res.json(orders);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:orderId', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const order = await Orders.findOne({
      include: [{ model: OrderItems, include: [Cards] }],
      where: { id: req.params.orderId },
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
