const router = require('express').Router();
const {
  models: { Cards },
} = require('../db');
const { isAuthenticated, isSameUser, isAdmin } = require('../authMiddleware');

/////// all routes mounted on /api/cards

// GET /api/cards
router.get('/', async (req, res, next) => {
  try {
    const cards = await Cards.findAll();
    res.json(cards);
  } catch (err) {
    next(err);
  }
});

// POST /api/cards
router.post('/', isAuthenticated, isAdmin, async (req, res, next) => {
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
router.get('/:id', async (req, res, next) => {
  try {
    const card = await Cards.findByPk(req.params.id);
    res.json(card);
  } catch (err) {
    next(err);
  }
});

// PUT /api/cards/:id
router.put('/:id', isAuthenticated, isAdmin, async (req, res, next) => {
  // update a card
  try {
    let card = await Cards.findByPk(req.params.id);
    card.name = req.body.name;
    card.imageUrl = req.body.imageUrl;
    card.price = req.body.price;
    card.description = req.body.description;
    card.quantity = req.body.quantity;
    card.category = req.body.category;
    card = await card.save();
    res.json(card);
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// DELETE /api/cards/:id
router.delete('/:id', isAuthenticated, isAdmin, async (req, res, next) => {
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
