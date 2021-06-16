const { db } = require('./server/db');
const Cards = require('./server/db/models/Cards');
const Address = require('./server/db/models/Address');
const User = require('./server/db/models/user');
const Orders = require('./server/db/models/order');
const OrderItems = require('./server/db/models/orderItem');

// test change

const cards = [
  {
    name: 'Blue-Eyes White Dragon',
    imageUrl: 'randomeimageofyugioh.com/fakeyugioh',
    price: 999.99,
    quantity: 8,
    category: 'Yu-Gi-Oh',
    description: 'Some yugioh card',
  },
  {
    name: 'Charizard',
    imageUrl: 'randomeimageofpokemon.com/fakepokemon',
    price: 99999.99,
    quantity: 10,
    category: 'Pokemon',
    description: 'Some pokemon card',
  },
  {
    name: 'Magic',
    imageUrl: 'randomeimageofmagic.com/fakemagic',
    price: 99.99,
    quantity: 3,
    category: 'Magic',
    description: 'Some magic card',
  },
];

const address = [
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

const user = [
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
];

const seed = async () => {
  try {
    await db.sync({ force: true });
    await Promise.all(cards.map((cards) => Cards.create(cards))).then(() =>
      Promise.all(address.map((address) => Address.create(address))).then(() =>
        Promise.all(user.map((users) => User.create(users)))
      )
    );

    // create an order for a user
    // create some order items for that order
    // const user = await User.findByPk(1);
    const cart1 = await Orders.create({ isOpen: true, total: 0, userId: 1 });
    const orderItems = [
      await OrderItems.create({ quantity: 1, cardId: 1, orderId: 1 }),
      await OrderItems.create({ quantity: 2, cardId: 2, orderId: 1 }),
      await OrderItems.create({ quantity: 5, cardId: 3, orderId: 1 }),
    ];

    const cart2 = await Orders.create({ isOpen: false, total: 0, userId: 1 });
    const orderItems2 = [
      await OrderItems.create({ quantity: 6, cardId: 1, orderId: 2 }),
      await OrderItems.create({ quantity: 3, cardId: 2, orderId: 2 }),
      await OrderItems.create({ quantity: 9, cardId: 3, orderId: 2 }),
    ];

    // test cart display:
    console.log('User 1 with cart:');

    let displayUser = await User.findAll({
      // raw: true,
      nest: true,
      where: { id: 1 },
      include: {
        model: Orders,
        include: { model: OrderItems, include: { model: Cards } },
      },
    });
    // console.log(displayUser[0].dataValues);

    console.log(displayUser[0].dataValues.orders);
    // console.log(displayUser);

    // seed your database here!
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
      db.close();
    })
    .catch((err) => {
      console.error('Oh noes! Something went wrong!');
      console.error(err);
      db.close();
    });
}
//testing
