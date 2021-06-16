const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/cards", require("./cards"));
router.use("/order", require("./orders"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// /USERS

//GET /USERS/:USERID will get users information
//GET /USERS/:USERID/CART will get users open cart (unpurchased)
//GET /USERS/:USERID/ORDERS will get all previous orders
//GET /USERS/:USERID/ORDERS/:ORDERID will get a user's single order (only accessed by the user associated with the ID)

// /CARDS

//GET /CARDS will findall() cards
//GET /CARDS/:ID will findByPk(req.params.id)

// /ORDERS
