/* global describe beforeEach it */

const { expect } = require('chai');
const request = require('supertest');
const { db } = require('../../server/db');
const User = require('../../server/db/models/user');

const seed = require('../../script/seed');
const app = require('../../server/app');
const OrderItems = require('../../server/db/models/orderItem');
const Orders = require('../../server/db/models/order');
const Cards = require('../../server/db/models/Cards');

describe('User routes', () => {
  let user1, user1Token, user2Token, user1Cart, adminToken;

  beforeEach(async () => {
    await seed();

    user1 = await User.create({
      username: 'user1',
      password: 'user1',
      firstname: 'user1',
      lastname: 'user1',
      email: 'user1@user.com',
    });
    user1Token = await User.authenticate({
      username: 'user1',
      password: 'user1',
    });

    user1Cart = await Orders.create({ userId: user1.id, total: 0 });

    user2 = await User.create({
      username: 'user2',
      password: 'user2',
      firstname: 'user2',
      lastname: 'user2',
      email: 'user2@user.com',
    });
    user2Token = await User.authenticate({
      username: 'user2',
      password: 'user2',
    });
    adminToken = await User.authenticate({
      username: 'admin',
      password: 'admin',
    });
  });

  afterEach(async () => {
    user1.destroy();
    user2.destroy();
  });

  describe('user info routes', () => {
    it('GET /api/users protected by admin token', async () => {
      let res = await request(app).get('/api/users').expect(401);
      res = await request(app)
        .get('/api/users')
        .set({ token: adminToken })
        .expect(200);
    });

    it('individual user info protected by login', async () => {
      // console.log(`user1.id: ${user1.id}`);
      let res = await request(app).get(`/api/users/${user1.id}`).expect(401);
      res = await request(app)
        .get(`/api/users/${user1.id}`)
        .set({ token: user1Token })
        .expect(200);
    });
    it('user info protected from other users', async () => {
      let res = await request(app)
        .get(`/api/users/${user1.id}`)
        .set({ token: user2Token })
        .expect(401);
    });
    it('admins can look at any user', async () => {
      let res = await request(app)
        .get(`/api/users/${user1.id}`)
        .set({ token: adminToken })
        .expect(200);
    });
  }); // end describe('/api/users')

  describe('cart add/update/delete routes', () => {
    it('PUT /api/users/:id/cart protected by login/admin', async () => {
      // card id, quantity in body
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .expect(401);
    });

    it('PUT /api/users/:id/cart protected from other users', async () => {
      // card id, quantity in body
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: user2Token })
        .send({ cardId: 1, quantity: 1 })
        .expect(401);
    });

    it('PUT /api/users/:id/cart available to logged in user', async () => {
      // card id, quantity in body
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .send({ cardId: 1, quantity: 1 })
        .expect(200);
    });

    it('PUT /api/users/:id/cart available to admin', async () => {
      // card id, quantity in body
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: adminToken })
        .send({ cardId: 1, quantity: 1 })
        .expect(200);
    });

    it('PUT /api/users/:id/cart with card and qty in body adds card to cart in db', async () => {
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: adminToken })
        .send({ cardId: 2, quantity: 1 })
        .expect(200);
      let orderItems = await Orders.findByPk(user1Cart.id, {
        include: [{ model: OrderItems, include: [{ model: Cards }] }],
      });
      expect(orderItems.get({ plain: true }).orderItems.length).to.equal(1);
    });

    it('PUT /api/users/:id/cart with card and qty 0 in body deletes card from order', async () => {
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .send({ cardId: 2, quantity: 2 })
        .expect(200);

      res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .send({ cardId: 2, quantity: 0 })
        .expect(200);

      let orderItems = await Orders.findByPk(user1Cart.id, {
        include: [{ model: OrderItems, include: [{ model: Cards }] }],
      });

      expect(orderItems.get({ plain: true }).orderItems.length).to.equal(0);
    });

    it('PUT /api/users/:id/cart with card and qty updates line item prices', async () => {
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .send({ cardId: 2, quantity: 2 })
        .expect(200);

      let cart = await Orders.findByPk(user1Cart.id, {
        include: [{ model: OrderItems, include: [{ model: Cards }] }],
      });

      expect(cart.get({ plain: true }).orderItems[0].price).to.equal(
        2 * cart.get({ plain: true }).orderItems[0].card.price
      );
    });

    xit('PUT /api/users/:id/cart with card and qty updates cart total', async () => {
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .send({ cardId: 2, quantity: 2 })
        .expect(200);

      let cart = await Orders.findByPk(user1Cart.id, {
        include: [{ model: OrderItems, include: [{ model: Cards }] }],
      });

      // console.log('???????');
      // console.log((await cart.get({ plain: true })).orderItems);
      let total = (await cart.get({ plain: true })).orderItems.reduce(
        (acc, orderItem) => {
          return (acc += orderItem.price);
        },
        0
      );

      expect(user1Cart.total).to.equal(total);
    });

    it('PUT /api/users/:id/cart with isOpen: false closes the cart and takes cards out of inventory', async () => {
      // add some stuff to a cart
      let res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .send({ cardId: 2, quantity: 2 })
        .expect(200);

      // get the cart instance
      let cart = await Orders.findByPk(user1Cart.id, {
        include: [{ model: OrderItems, include: [{ model: Cards }] }],
      });

      // get a card quantity
      let orderItem = await OrderItems.findOne({
        where: { orderId: cart.id },
        include: Cards,
      });

      // get the card info
      let cardId = orderItem.cardId;
      let card = await Cards.findByPk(cardId);

      res = await request(app)
        .put(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .send({ isOpen: 'false' })
        .expect(200);

      cart = await Orders.findByPk(user1Cart.id, {
        include: [{ model: OrderItems, include: [{ model: Cards }] }],
      });

      expect(cart.isOpen).to.equal(false);
      expect((await Cards.findByPk(cardId)).quantity).to.equal(
        card.quantity - orderItem.quantity
      );
    });

    it('POST /api/userId/cart creates a new cart, if there is not already one open, otherwise status 400', async () => {
      await user1Cart.destroy();

      let res = await request(app)
        .post(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .expect(200);

      res = await request(app)
        .post(`/api/users/${user1.id}/cart`)
        .set({ token: user1Token })
        .expect(400);
    });
  });
}); // end describe('User routes')
