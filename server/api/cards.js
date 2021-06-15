const router = require("express").Router();
const {
  models: { Cards },
} = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const cards = await Cards.findAll();
    res.json(cards);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const card = await Cards.findByPk(req.params.id);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
