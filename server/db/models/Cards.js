const { SequelizeScopeError } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("./database");

const Cards = db.define("cards", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.TEXT,
    defaultValue:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.theactivetimes.com%2Ftravel%2Fmost-beautiful-college-campuses-america&psig=AOvVaw3uq1A_ruznPq_i--izFvFM&ust=1621527650791000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOCG16-T1vACFQAAAAAdAAAAABAD",
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Cards;
