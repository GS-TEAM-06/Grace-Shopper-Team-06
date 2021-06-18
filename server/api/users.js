const router = require('express').Router();
const {
  models: { User },
} = require('../db');
const Orders = require('../db/models/order');
const Cards = require('../db/models/Cards');
const OrderItems = require('../db/models/orderItem');
const { isAuthenticated, isSameUser, isAdmin } = require('../authMiddleware');

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
router.get('/:userId', isAuthenticated, isSameUser, async (req, res, next) => {
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
router.get(
  '/:userId/orders',
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      if (req.user.id != req.params.userId) {
        const error = new Error('Unauthorized!');
        error.status = 401;
        throw error;
      }

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
  }
);

router.get(
  '/:userId/cart',
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      if (req.user.id != req.params.userId) {
        const error = new Error('Unauthorized!');
        error.status = 401;
        throw error;
      }

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
  }
);

//ADD ITEM TO CART
router.post('/', isAuthenticated, isSameUser, async (req, res, next) => {
  try {
    const singleItem = await OrderItems.create(req.body);
    res.json(singleItem);
  } catch (error) {
    next(error);
  }
});

//UPDATE ITEM IN CART
router.put(
  '/:userId/cart',
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      if (req.user.id != req.params.userId) {
        const error = new Error('Unauthorized!');
        error.status = 401;
        throw error;
      }

      let cart = await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { userId: req.params.userId, isOpen: true },
      });
      if (cart === null) {
        const error = new Error('Cart not found!');
        error.status = 404;
        throw error;
      }
      cart = cart.get({ plain: true });
      const card = await Cards.findByPk(req.body.cardId);
      if (card === null) {
        const error = new Error('Card not found!');
        error.status = 404;
        throw error;
      }

      for (let i = 0; i < cart.orderItems.length; i++) {
        if (cart.orderItems[i].cardId === req.body.cardId) {
          // we already have this card in the cart, increqment quantity and price
          cart.orderItems[i].quantity++;
          cart.save();
        } else {
          // create new OrderItem with cardId = req.body.cardId
          const orderItem = await OrderItems.create({
            quantity: 1,
            cardId: req.body.cardId,
            orderId: cart.id,
          });
          cart.orderItems.push(orderItem);
        }
      }

      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);

//DELETE ITEM IN CART
router.delete(
  '/:userId/cart',
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      if (req.user.id != req.params.userId) {
        const error = new Error('Unauthorized!');
        error.status = 401;
        throw error;
      }

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
  }
);

module.exports = router;
