/* global describe beforeEach it */

const { expect } = require('chai');
const request = require('supertest');
const { db } = require('../../server/db');
const User = require('../../server/db/models/user');

const seed = require('../../script/seed');
const app = require('../../server/app');
const OrderItems = require('../../server/db/models/orderItem');
const Orders = require('../../server/db/models/order');

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

    // user1Cart = await Orders.create({})

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
}); // end describe('User routes')
