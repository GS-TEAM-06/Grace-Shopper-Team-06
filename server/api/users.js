const router = require("express").Router();
const {
  models: {User},
} = require("../db");
const Orders = require("../db/models/order");
const Cards = require("../db/models/Cards");
const OrderItems = require("../db/models/orderItem");
const {isAuthenticated, isSameUser, isAdmin} = require("../authMiddleware");

// get /api/users/ => return all users
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

// get /api/users/:id => returns an individual user
router.get("/:userId", isAuthenticated, isSameUser, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (user === null) {
      const error = new Error("Not found!");
      error.status = 404;
      throw error;
    }

    delete user.password;
    res.json(user.get({plain: true}));
  } catch (err) {
    next(err);
  }
});

// get /api/users/:id/orders => returns an individual user's past orders
router.get(
  "/:userId/orders",
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      if (req.user.id != req.params.userId) {
        const error = new Error("Unauthorized!");
        error.status = 401;
        throw error;
      }

      const orders = await User.findByPk(req.params.userId, {
        nested: true,
        include: [
          {
            model: Orders,
            where: {isOpen: false},
            include: [{model: OrderItems, include: [Cards]}],
          },
        ],
        where: {userId: req.params.userId},
      });
      if (orders === null) {
        const error = new Error("Not found!");
        error.status = 404;
        throw error;
      }

      res.json(orders.get({plain: true}));
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:userId/cart",
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      if (req.user.id != req.params.userId) {
        const error = new Error("Unauthorized!");
        error.status = 401;
        throw error;
      }

      const cart = await Orders.findOne({
        include: [{model: OrderItems, include: [Cards]}],
        where: {userId: req.params.userId, isOpen: true},
      });
      if (cart === null) {
        const error = new Error("Not found!");
        error.status = 404;
        throw error;
      }

      res.json(cart.get({plain: true}));
    } catch (err) {
      next(err);
    }
  }
);

//ADD ITEM TO CART
router.post("/", isAuthenticated, isSameUser, async (req, res, next) => {
  try {
    const singleItem = await OrderItems.create(req.body);
    res.json(singleItem);
  } catch (error) {
    next(error);
  }
});

//UPDATE ITEM IN CART
router.put(
  "/:userId/cart",
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      // find the cart instance that matches this user's id
      let cart = await Orders.findOne({
        include: [{model: OrderItems, include: [Cards]}],
        where: {userId: req.params.userId, isOpen: true},
      });

      // get a plain object for the cart instance dataValues
      let plainCart = cart.get({plain: true});

      // check to make sure we found a cart
      if (cart === null) {
        const error = new Error("Cart not found!");
        error.status = 404;
        throw error;
      }

      // get the card instance that matches cardId
      const card = await Cards.findByPk(req.body.cardId);

      // check to make sure we found the card
      if (card === null) {
        const error = new Error("Card not found!");
        error.status = 404;
        throw error;
      }

      // walk through the orderItems in this cart
      // if the card is already in the card, increment it's quantity
      let orderItem = false;
      for (let i = 0; i < plainCart.orderItems.length; i++) {
        if (
          Number(plainCart.orderItems[i].cardId) === Number(req.body.cardId)
        ) {
          orderItem = await OrderItems.update(
            {quantity: plainCart.orderItems[i].quantity + 1},
            {where: {cardId: plainCart.orderItems[i].cardId}}
          );

          // if for some reason we didn't update anything, throw a 500 error
          if (orderItem[0] === 0) {
            const error = new Error("Couldn't update quantity!");
            error.status = 500;
            throw error;
          }
        }
      }

      // if we get here with updated === false, we didn't have the card in the cart already
      if (orderItem === false) {
        // create new OrderItem with cardId = req.body.cardId
        orderItem = await OrderItems.create({
          quantity: 1,
          cardId: req.body.cardId,
          orderId: plainCart.id,
        });
      }

      // get a fresh instance of the cart
      cart = await Orders.findOne({
        include: [{model: OrderItems, include: [Cards]}],
        where: {userId: req.params.userId, isOpen: true},
      });

      // send it back, in JSON.stringify format! (this is very confusing that sequelize magically does this)
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);

//DELETE ITEM IN CART
router.delete(
  "/:userId/cart",
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      // find the cart instance that matches this user's id
      let cart = await Orders.findOne({
        include: [{model: OrderItems, include: [Cards]}],
        where: {userId: req.params.userId, isOpen: true},
      });

      // get a plain object for the cart instance dataValues
      let plainCart = cart.get({plain: true});

      // check to make sure we found a cart
      if (cart === null) {
        const error = new Error("Cart not found!");
        error.status = 404;
        throw error;
      }

      // walk through the orderItems in this cart
      // if the card quantity is greater than one, decrement the quantity
      for (let i = 0; i < plainCart.orderItems.length; i++) {
        if (
          plainCart.orderItems[i].cardId === req.body.cardId
        ) {
          if (plainCart.orderItems[i].quantity > 1) {
            await OrderItems.update(
              {quantity: plainCart.orderItems[i].quantity - 1},
              {where: {cardId: plainCart.orderItems[i].cardId}}
            );

            // else if card quantity is only 1, delete the orderItem
          } else if (plainCart.orderItems[i].quantity === 1) {
            await OrderItems.destroy({
              where: {cardId: plainCart.orderItems[i].cardId}
            });
          }
        }
      }

      // get a fresh instance of the cart
      cart = await Orders.findOne({
        include: [{model: OrderItems, include: [Cards]}],
        where: {userId: req.params.userId, isOpen: true},
      });
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
