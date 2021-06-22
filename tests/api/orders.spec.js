/* global describe beforeEach it */

const { expect } = require('chai');
const request = require('supertest');
const Orders = require('../../server/db/models/order');
const OrderItems = require('../../server/db/models/orderItem');
const Cards = require('../../server/db/models/Cards');
const User = require('../../server/db/models/user');

const seed = require('../../script/seed');
const app = require('../../server/app');

describe('Order routes', async () => {
  let token;
  beforeEach(async () => {
    await seed();
    token = await User.authenticate({
      username: 'admin',
      password: 'admin',
    });
  });

  describe('/api/orders/', () => {
    it('GET /api/orders protected by admin login', async () => {
      // should fail, not authenticated as admin
      let res = await request(app).get('/api/orders').expect(401);
      expect(res.body).to.deep.equal({});
    });
    it('GET /api/orders returns all orders', async () => {
      let res = await request(app)
        .get('/api/orders')
        .set({ token })
        .expect(200);

      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(await Orders.count());
    });

    it('GET /api/orders/:id returns that order', async () => {
      let order = await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
      });
      let res = await request(app)
        .get(`/api/orders/${order.id}`)
        .set({ token })
        .expect(200);
      expect(res.body.id).to.deep.equal(order.id);
    });

    it('GET /api/orders/:id protected by admin login', async () => {
      let order = await Orders.findOne({
        include: [{ model: OrderItems, include: [Cards] }],
      });
      let res = await request(app).get(`/api/orders/${order.id}`).expect(401);
    });
  }); // end describe('/api/users')
}); // end describe('User routes')
