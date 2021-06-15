const { db } = require("./server/db");
const Cards = require("./server/db/Cards");
const Address = require("./server/db/Address");
const User = require("./server/db/user");

const cards = [
  {
    name: "Blue-Eyes White Dragon",
    imageUrl: "randomeimageofyugioh.com/fakeyugioh",
    price: 999.99,
    quantity: 8,
    category: "Yu-Gi-Oh",
    description: "Some yugioh card",
  },
  {
    name: "Charizard",
    imageUrl: "randomeimageofpokemon.com/fakepokemon",
    price: 99999.99,
    quantity: 10,
    category: "Pokemon",
    description: "Some pokemon card",
  },
  {
    name: "Magic",
    imageUrl: "randomeimageofmagic.com/fakemagic",
    price: 99.99,
    quantity: 3,
    category: "Magic",
    description: "Some magic card",
  },
];

const address = [
  {
    address: "1111 Fake St",
    city: "Chicago",
    state: "Illinois",
    zip: "66666",
    firstname: "John",
    lastname: "Smith",
  },
  {
    address: "2222 Fake Blvd",
    city: "New York",
    state: "New York",
    zip: "44444",
    firstname: "Jane",
    lastname: "Doe",
  },
  {
    address: "3333 State St",
    city: "Los Angeles",
    state: "California",
    zip: "77777",
    firstname: "Ash",
    lastname: "Ketchum",
  },
  {
    address: "4444 Main St",
    city: "Boston",
    state: "Massachusetts",
    zip: "11111",
    firstname: "Yami",
    lastname: "Yugi",
  },
];

const user = [
  {
    username: "pokemoncollector",
    password: "Pallet Town",
    firstname: "Peter",
    lastname: "Park",
    email: "one@team6.com",
  },
  {
    username: "yugiohcollector",
    password: "Yugioh",
    firstname: "Garrick",
    lastname: "Lim",
    email: "two@team6.com",
  },
  {
    username: "MagicCollector",
    password: "Magic",
    firstname: "Gabriel",
    lastname: "Ytterberg",
    email: "three@team6.com",
  },
  {
    username: "CardCollector",
    password: "Cards",
    firstname: "Sherman",
    lastname: "Tung",
    email: "four@team6.com",
  },
  {
    username: "UnknownCollector",
    password: "Collector",
    firstname: "Anonymous",
    lastname: "person",
    email: "unknown@team6.com",
  },
];

const seed = async () => {
  try {
    await db.sync({ force: true });
    await Promise.all(cards.map((cards) => Cards.create(cards))).then(() =>
      Promise.all(address.map((address) => Address.create(address))).then(() =>
        Promise.all(user.map((user) => User.create(user)))
      )
    );
    // seed your database here!
  } catch (err) {
    console.log(red(err));
  }
};

module.exports = seed;
// If this module is being required from another module, then we just export the
// function, to be used as necessary. But it will run right away if the module
// is executed directly (e.g. `node seed.js` or `npm run seed`)
if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seeding success!");
      db.close();
    })
    .catch((err) => {
      console.error("Oh noes! Something went wrong!");
      console.error(err);
      db.close();
    });
}
//testing
