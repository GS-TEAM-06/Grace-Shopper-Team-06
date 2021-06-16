const router = require("express").Router();
const {
  models: { Order, OrderItem },
} = require("../db");

// GET ROUTE /orders/orderId

router.get("/:id", async (req, res, next) => {
  try {
    const cart = (
      await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { id: req.params.id },
      })
    ).get({ plain: true });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
