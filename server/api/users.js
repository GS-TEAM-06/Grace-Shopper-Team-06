const router = require("express").Router();
const {
  models: { User, Orders },
} = require("../db");
const Cards = require("../db/models/Cards");
const OrderItems = require("../db/models/orderItem");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "username"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/orders", async (req, res, next) => {
  try {
    const orders = (
      await User.findByPk(req.params.id, {
        include: [
          {
            model: Orders,
            include: [{ model: OrderItems, include: [{ model: Cards }] }],
          },
        ],
      })
    ).get({ plain: true });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// router.get("/:id/orders/:id", async (req, res, next) => {
//   try {
//     const orders = (
//       await User.findByPk(req.params.id, {
//         include: [
//           {
//             model: Orders,
//             include: [{ model: OrderItems, include: [{ model: Cards }] }],
//           },
//         ],
//       })
//     ).get({ plain: true });
//     res.json(orders);
//   } catch (err) {
//     next(err);
//   }
// });
