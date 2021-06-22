const fs = require('fs');

const { db } = require('../server/db');
const Cards = require('../server/db/models/Cards');
const Address = require('../server/db/models/Address');
const User = require('../server/db/models/user');
const Orders = require('../server/db/models/order');
const OrderItems = require('../server/db/models/orderItem');

// test change

const rawCards = [
  {
    name: 'Blue-Eyes White Dragon',
    imageUrl: 'randomeimageofyugioh.com/fakeyugioh',
    price: 900,
    quantity: 80,
    category: 'Yu-Gi-Oh',
    description: 'Some yugioh card',
  },
  {
    name: 'Charizard',
    imageUrl: 'randomeimageofpokemon.com/fakepokemon',
    price: 80000,
    quantity: 100,
    category: 'Pokemon',
    description: 'Some pokemon card',
  },
  {
    name: 'Magic',
    imageUrl: 'randomeimageofmagic.com/fakemagic',
    price: 100,
    quantity: 30,
    category: 'Magic',
    description: 'Some magic card',
  },
];

const rawAddresses = [
  {
    address: '1111 Fake St',
    city: 'Chicago',
    state: 'Illinois',
    zipcode: '66666',
    firstname: 'John',
    lastname: 'Smith',
  },
  {
    address: '2222 Fake Blvd',
    city: 'New York',
    state: 'New York',
    zipcode: '44444',
    firstname: 'Jane',
    lastname: 'Doe',
  },
  {
    address: '3333 State St',
    city: 'Los Angeles',
    state: 'California',
    zipcode: '77777',
    firstname: 'Ash',
    lastname: 'Ketchum',
  },
  {
    address: '4444 Main St',
    city: 'Boston',
    state: 'Massachusetts',
    zipcode: '11111',
    firstname: 'Yami',
    lastname: 'Yugi',
  },
];

const rawUsers = [
  {
    username: 'pokemoncollector',
    password: 'Pallet Town',
    firstname: 'Peter',
    lastname: 'Park',
    email: 'one@team6.com',
  },
  {
    username: 'yugiohcollector',
    password: 'Yugioh',
    firstname: 'Garrick',
    lastname: 'Lim',
    email: 'two@team6.com',
  },
  {
    username: 'MagicCollector',
    password: 'Magic',
    firstname: 'Gabriel',
    lastname: 'Ytterberg',
    email: 'three@team6.com',
  },
  {
    username: 'CardCollector',
    password: 'Cards',
    firstname: 'Sherman',
    lastname: 'Tung',
    email: 'four@team6.com',
  },
  {
    username: 'UnknownCollector',
    password: 'Collector',
    firstname: 'Anonymous',
    lastname: 'person',
    email: 'unknown@team6.com',
  },
  {
    username: 'admin',
    password: 'admin',
    firstname: 'admin',
    lastname: 'admin',
    email: 'admin@user.com',
    admin: true,
  },
];

const seed = async () => {
  try {
    await db.sync({ force: true });

    let rawData = fs.readFileSync('./script/pokescraper/cards.json');
    let cards = JSON.parse(rawData);

    cards = await Promise.all(cards.map((card) => Cards.create(card)));
    const addresses = await Promise.all(
      rawAddresses.map((address) => Address.create(address))
    );
    const users = await Promise.all(rawUsers.map((user) => User.create(user)));

    // create an order for a user
    // create some order items for that order
    // const user = await User.findByPk(1);
    const carts = [
      await Orders.create({ isOpen: true, total: 0, userId: 1 }),
      await Orders.create({ isOpen: true, total: 0, userId: 1 }),
    ];
    const orderItems = [
      await OrderItems.create({ quantity: 1, cardId: 1, orderId: 1 }),
      await OrderItems.create({ quantity: 2, cardId: 2, orderId: 1 }),
      await OrderItems.create({ quantity: 5, cardId: 3, orderId: 1 }),
    ];

    const orderItems2 = [
      await OrderItems.create({ quantity: 6, cardId: 1, orderId: 2 }),
      await OrderItems.create({ quantity: 3, cardId: 2, orderId: 2 }),
      await OrderItems.create({ quantity: 9, cardId: 3, orderId: 2 }),
    ];

    // test cart display:
    // console.log('An open cart with items:');

    // let displayUser = await User.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { id: 1 },
    //   include: {
    //     model: Orders,
    //     include: { model: OrderItems, include: { model: Cards } },
    //   },
    // });

    // displayUser = await User.findByPk(1, { raw: true });
    // // console.log(displayUser);
    // let cart = (await Orders.findByPk(1, { include: OrderItems })).dataValues;
    // let cart = (
    //   await Orders.findOne({
    //     include: [{ model: OrderItems, include: [Cards] }],
    //     where: { isOpen: true },
    //   })
    // ).get({ plain: true });
    // console.log(cart);

    // let userWithOrders = await User.findByPk(userId);
    // console.log('First card in first order:', cart.orderItems[0].card);

    // console.log(displayUser[0].dataValues);

    // console.log(displayUser[0]);
    // console.log(displayUser);

    // seed your database here!

    // console.log('>>>>>>>>>>>> Closing carts:');
    // carts[0] = await carts[0].update({ isOpen: false });
    // carts[1] = await carts[1].update({ isOpen: false });
    // carts[0].isOpen = false;
    // carts[1].isOpen = false;
    // await cards[0].save();
    // await cards[1].save();

    return { users, cards, addresses, carts };
  } catch (err) {
    console.log(err);
  }
};

module.exports = seed;
// If this module is being required from another module, then we just export the
// function, to be used as necessary. But it will run right away if the module
// is executed directly (e.g. `node seed.js` or `npm run seed`)
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding success!');
      // db.close();
    })
    .catch((err) => {
      console.error('Oh noes! Something went wrong!');
      console.error(err);
      db.close();
    });
}
//testing
