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

router.get("/:userId", async (req, res, next) => {
  try {
    const user = (await User.findByPk(req.params.userId)).get({ plain: true });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/orders", async (req, res, next) => {
  try {
    const orders = (
      await User.findByPk(req.params.userId, {
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

router.get("/:userId/cart", async (req, res, next) => {
  try {
    const cart = (
      await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { userId: userId, isOpen: true },
      })
    ).get({ plain: true });
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

//GET /USERS/:USERID will get users information
//GET /USERS/:USERID/CART will get users open cart (unpurchased)
//GET /USERS/:USERID/ORDERS will get all previous orders
//GET /USERS/:USERID/ORDERS/:ORDERID will get a user's single order (only accessed by the user associated with the ID)

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
