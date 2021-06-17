const router = require('express').Router();
const {
  models: { User },
} = require('../db');
const Orders = require('../db/models/order');
const Cards = require('../db/models/Cards');
const OrderItems = require('../db/models/orderItem');

// get /api/users/ => return all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'username'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// get /api/users/:id => returns an individual user
router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (user === null) {
      const error = new Error('Not found!');
      error.status = 404;
      throw error;
    }

    delete user.password;
    res.json(user.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

// get /api/users/:id/orders => returns an individual user's past orders
router.get('/:userId/orders', async (req, res, next) => {
  try {
    const orders = await User.findByPk(req.params.userId, {
      nested: true,
      include: [
        {
          model: Orders,
          where: { isOpen: false },
          include: [{ model: OrderItems, include: [Cards] }],
        },
      ],
      where: { userId: req.params.userId },
    });
    if (orders === null) {
      const error = new Error('Not found!');
      error.status = 404;
      throw error;
    }

    res.json(orders.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

router.get('/:userId/cart', async (req, res, next) => {
  try {
    const cart = await Orders.findOne({
      include: [{ model: OrderItems, include: [Cards] }],
      where: { userId: req.params.userId, isOpen: true },
    });
    if (cart === null) {
      const error = new Error('Not found!');
      error.status = 404;
      throw error;
    }

    res.json(cart.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

//ADD ITEM TO CART
router.post('/', async (req, res, next) => {
  try {
    const singleItem = await OrderIems.create(req.body);
    res.json(singleItem);
  } catch (error) {
    next(error);
  }
});

//UPDATE ITEM IN CART
router.put('/:userId/cart', async (req, res, next) => {
  try {
    let cart = await Orders.findOne({
      include: [{ model: OrderItems, include: [Cards] }],
      where: { userId: req.params.userId, isOpen: true },
    });
    if (cart === null) {
      const error = new Error('Not found!');
      error.status = 404;
      throw error;
    }

    cart = await cart.update(req.body);
    res.json(cart.get({ plain: true }));
  } catch (error) {
    next(error);
  }
});

//DELETE ITEM IN CART
router.delete('/:userId/cart', async (req, res, next) => {
  try {
    const cart = (
      await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { userId: userId, isOpen: true },
      })
    ).get({ plain: true });
    await cart.destroy();
    res.json(cart);
  } catch (error) {
    next(error);
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

module.exports = router;
