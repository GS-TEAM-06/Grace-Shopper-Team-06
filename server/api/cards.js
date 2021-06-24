const router = require("express").Router();
const {
  models: { Cards },
} = require("../db");
const { isAuthenticated, isSameUser, isAdmin } = require("../authMiddleware");

/////// all routes mounted on /api/cards

// GET /api/cards
router.get("/", async (req, res, next) => {
  let category = null;
  if (
    typeof req.query.category !== "undefined" &&
    req.query.category !== "all"
  ) {
    category = { where: { category: req.query.category } };
  }

  try {
    const cards = await Cards.findAll({ ...category });
    res.json(cards);
  } catch (err) {
    next(err);
  }
});

// change

// POST /api/cards
router.post("/", isAuthenticated, isAdmin, async (req, res, next) => {
  // console.log(req.body);
  try {
    const result = await Cards.create({
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
      category: req.body.category,
    });
    res.json(result.get({ plain: true }));
  } catch (error) {
    next(error);
  }
});

// GET /api/cards/:id
router.get("/:id", async (req, res, next) => {
  try {
    const card = await Cards.findByPk(req.params.id);
    if (card === null) {
      // const error = new Error('Card not found!');
      // error.status = 404;
      // next(error);
      res.status(404).end("Card not found!");
    } else {
      res.json(card);
    }
  } catch (err) {
    next(err);
  }
});

// PUT /api/cards/:id
router.put("/:id", isAuthenticated, isAdmin, async (req, res, next) => {
  // update a card
  try {
    const card = await Cards.findByPk(req.params.id);
    card = await card.save();
    res.json(await card.update(req.body));
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// DELETE /api/cards/:id
router.delete("/:id", isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const result = await Cards.destroy({ where: { id: req.params.id } });
    if (result === 0) {
      const error = new Error(`Card ${req.params.id} not found!`);
      error.status = 500;
      throw error;
    } else {
      res.json(`Deleted card ${req.params.id}!`);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
