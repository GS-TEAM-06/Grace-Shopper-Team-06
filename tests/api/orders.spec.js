/* global describe beforeEach it */

const { expect } = require('chai');
const request = require('supertest');
const {
  db,
  // models: { Orders },
} = require('../../server/db');
const Orders = require('../../server/db/models/order');
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
    it('GET /api/orders', async () => {
      // should fail, not authenticated as admin
      let res = await request(app).get('/api/users').expect(401);
      expect(res.body).to.deep.equal({});

      res = await request(app).get('/api/users').set({ token }).expect(200);

      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(6);
    });

    xit('adding a new order item adds it to the cart with its price', () => {
      expect(false).to.equal(true);
    });
    xit('adding an existing order item increases quantity in the cart and updates price', () => {
      expect(false).to.equal(true);
    });
    xit('deleting an order item removes it from the cart', () => {
      expect(false).to.equal(true);
    });
    xit('closing a cart removes inventory from the cards db', () => {
      expect(false).to.equal(true);
    });
  }); // end describe('/api/users')
}); // end describe('User routes')
