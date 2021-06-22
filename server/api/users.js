const router = require("express").Router();
const {
  models: { User },
} = require("../db");
const Orders = require("../db/models/order");
const Cards = require("../db/models/Cards");
const OrderItems = require("../db/models/orderItem");
const { isAuthenticated, isSameUser, isAdmin } = require("../authMiddleware");

// get /api/users/ => return all users
router.get("/", isAuthenticated, isAdmin, async (req, res, next) => {
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
      next(error);
    }

    delete user.password;
    res.json(user.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/:id => update a user account

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
        next(error);
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
        const error = new Error("Not found!");
        error.status = 404;
        next(error);
      }

      res.json(orders.get({ plain: true }));
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
      const cart = await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { userId: req.params.userId, isOpen: true },
      });
      if (cart === null) {
        const error = new Error("Not found!");
        error.status = 404;
        next(error);
      }

      res.json(cart.get({ plain: true }));
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

//UPDATE ITEM IN CART: cardId, quantity method
router.put(
  "/:userId/cart",
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      console.log("api reqbody->", req.body);
      // find the cart instance that matches this user's id
      let cart = await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { userId: req.params.userId, isOpen: true },
      });

      // check to make sure we found a cart
      if (cart === null) {
        const error = new Error("Cart not found!");
        error.status = 404;
        next(error);
      }

      // did we get an isOpen=false in body? If so, close the cart.
      if (req.body.isOpen === "false") {
        cart = await cart.update({ isOpen: false });
        res.json(cart);
      } else {
        // did we get a quantity? Default is to add 1
        if (typeof req.body.quantity === "undefined") {
          req.body.quantity = 1;
        }

        // get a plain object for the cart instance dataValues
        let plainCart = await cart.get({ plain: true });

        // get the card instance that matches cardId
        const card = await Cards.findByPk(req.body.cardId);

        // check to make sure we found the card
        if (card === null) {
          const error = new Error("Card not found!");
          error.status = 404;
          next(error);
        }

        // walk through the orderItems in this cart
        // if the card is already in the cart, change it's quantity
        // if the quantity is 0, delete the orderItem
        let orderItem;
        let updated = false;
        for (let i = 0; i < plainCart.orderItems.length; i++) {
          if (
            Number(plainCart.orderItems[i].cardId) === Number(req.body.cardId)
          ) {
            // if quantity is 0 we need to actually delete the line
            if (Number(plainCart.orderItems[i].quantity) === 0) {
              orderItem = await (
                await OrderItems.findByPk(plainCart.orderItems[i].id)
              ).destroy();
              updated = true;
            } else {
              orderItem = await (
                await OrderItems.findByPk(plainCart.orderItems[i].id)
              ).update({
                quantity: plainCart.orderItems[i].quantity + 1,
              });
              updated = true;
            }

            // if for some reason we didn't update anything, throw a 500 error
            if (orderItem[0] === 0) {
              const error = new Error("Couldn't update quantity!");
              error.status = 500;
              next(error);
            }
          }
        }

        // if we get here with orderItem === false, we didn't have the card in the cart already
        if (updated === false) {
          // create new OrderItem with cardId = req.body.cardId
          orderItem = await OrderItems.create({
            quantity: 1,
            cardId: req.body.cardId,
            orderId: plainCart.id,
          });
        }

        // get a fresh instance of the cart
        cart = await Orders.findOne({
          include: [{ model: OrderItems, include: [Cards] }],
          where: { userId: req.params.userId, isOpen: true },
        });

        // send it back, in JSON.stringify format! (this is very confusing that sequelize magically does this)
        res.json(cart);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:userId/cart",
  isAuthenticated,
  isSameUser,
  async (req, res, next) => {
    try {
      // create a new open cart, if there is none already
      let cart = await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { userId: req.params.userId, isOpen: true },
      });

      // check to make sure we found a cart
      if (cart !== null) {
        const error = new Error("Cart already open!");
        error.status = 400;
        next(error);
      }

      cart = await Orders.create({
        total: 0,
        userId: Number(req.user.id),
        isOpen: true,
      });

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
    console.log("Am I in the delete route?");
    try {
      // find the cart instance that matches this user's id
      let cart = await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { userId: req.params.userId, isOpen: true },
      });

      // get a plain object for the cart instance dataValues
      let plainCart = cart.get({ plain: true });

      // check to make sure we found a cart
      if (cart === null) {
        const error = new Error("Cart not found!");
        error.status = 404;
        next(error);
      }
      console.log("plainCart->", plainCart.orderItems[2].quantity);
      // walk through the orderItems in this cart
      // if the card quantity is greater than one, decrement the quantity
      console.log("What is req.body.caardId--->,", req.body.cardId);
      for (let i = 0; i < plainCart.orderItems.length; i++) {
        if (
          Number(plainCart.orderItems[i].cardId) === Number(req.body.cardId)
        ) {
          if (Number(plainCart.orderItems[i].quantity) > 1) {
            console.log("Line 277-->");
            let orderItem = await (
              await OrderItems.findByPk(plainCart.orderItems[i].id)
            ).update(
              { quantity: plainCart.orderItems[i].quantity - 1 }
              // { where: { cardId: plainCart.orderItems[i].cardId } }
            );
            console.log("orderItem--->", orderItem);
            // else if card quantity is only 1, delete the orderItem
          } else if (plainCart.orderItems[i].quantity === 1) {
            await (
              await OrderItems.findByPk(plainCart.orderItems[i].id)
            ).destroy();
            // where: { cardId: plainCart.orderItems[i].cardId },
          }
        }
      }

      // get a fresh instance of the cart
      cart = await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
        where: { userId: req.params.userId, isOpen: true },
      });
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
